
function GetShaderCode(id)
{
    var shaderScript = document.getElementById(id);
    if(!shaderScript) return null;

    var str = "";
    var k = shaderScript.firstChild;

    while(k)
    {
        if(k.nodeType==3)
            str += k.textContent;
        k = k.nextSibling;
    }
	return str;
}

Demo = 
{
	minSizeOrderLoc : -1,
	maxSizeOrderLoc : -1,
	timeLoc : -1,
	rateLoc : -1,
	lifeTimeLoc : -1,
	viewportLoc : -1,
	startIndexLoc: -1,
	
	canvas : null,

	progId : 0,
	bufId : 0,

	paused : false,
	speed : 0.5,
	time : 0,
	absTime : 0,
	lifeTime : 5,
	rate : 10000,
	
	gl : null,
	
	projMatrix : Matrix.I(4),
	worldViewMatrix : Matrix.I(4),
	
	upPressed : false,
	downPressed : false,
	
	OnWindowResize : function()
	{
		Demo.canvas.width  = window.innerWidth;
		Demo.canvas.height = window.innerHeight;
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		SetMatrixUniform(this.gl, this.progId, "ProjMatrix", this.projMatrix);
		this.gl.uniform2f(this.viewportLoc, this.canvas.width, this.canvas.height);
	},

	Init : function()
	{
		this.canvas = document.getElementById("canvas");
		if(!this.canvas) alert("Could not initialize canvas.");
		
		try
		{
			this.gl = this.canvas.getContext("webgl");
			if(!this.gl) this.gl = this.canvas.getContext("experimental-webgl");
		}
		catch(e) {}

		if(!this.gl) alert("Could not initialize WebGL.");

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		this.effect = {
			VertexTemplateCode : GetShaderCode("VertexTemplateCode"),
			FragmentShaderCode : GetShaderCode("FragmentShaderCode"),
			
			ColorFunction : "vec3 mainColor = mix( f3rand(vec2(floor(birthTime), 42.1)), f3rand(vec2(floor(birthTime)+1.0, 42.1)), fract(birthTime) )*4.0;\
				vec3 startColor = f3rand(vec2(birthTime, 342.1))*0.1;\
				vec3 finalColor = f3rand(vec2(birthTime, 39.6));\
				return vec4( mix(startColor, finalColor, factor)*mainColor, (1.0-factor)*(1.0-factor) );",
			
			EmitterPositionFunction : SomeEmitterTrajectoryFunction,
			EmitterRotationFunction : "return vec3(5.2, -5., -3.)*t;",
			PositionFunction : SomeParticleTrajectoryFunction,
			SizeFunction : SomeSizeFunction,
			StartParametersFunction : SomeEmitterFunction
		};

		this.progId = ParticleEffectDescToShader(this.gl, this.effect);

		this.timeLoc = this.gl.getUniformLocation(this.progId, "Time");
		this.rateLoc = this.gl.getUniformLocation(this.progId, "Rate");
		this.lifeTimeLoc = this.gl.getUniformLocation(this.progId, "LifeTime");

		this.viewportLoc = this.gl.getUniformLocation(this.progId, "ViewportSize");

		this.minSizeOrderLoc = this.gl.getUniformLocation(this.progId, "MinSizeOrder");
		this.maxSizeOrderLoc = this.gl.getUniformLocation(this.progId, "MaxSizeOrder");
		this.startIndexLoc = this.gl.getUniformLocation(this.progId, "StartIndex");

		
		
		
		var buffer = new ArrayBuffer(65536);
		var array = new Float32Array(buffer);
		for(var i=0; i<16384; i++) array[i] = i;
		
		this.bufId = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufId);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);
		array = null;
		buffer = null;

		this.gl.vertexAttribPointer(0, 1, this.gl.FLOAT, false, 4, 0);

		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

		
		this.projMatrix = makePerspective(60, this.canvas.width/this.canvas.height, 0.1, 100);

		this.rate = 10000;
		this.lifeTime = 5;
		this.gl.uniform1f(this.rateLoc, this.rate);
		this.gl.uniform1f(this.lifeTimeLoc, this.lifeTime);

		this.gl.uniform1f(this.minSizeOrderLoc, 0.0);
		this.gl.uniform1f(this.maxSizeOrderLoc, 2.5);

		this.time = 0;
		this.speed = 0.5;
		this.paused = false;
		
		window.onkeydown = function(e)
		{
			if(e.keyCode==73) Demo.time = 0.0;
			if(e.keyCode>=49 && e.keyCode<=57)
			{
				var rates = [2000, 2000, 10000, 10000, 100000, 100000, 200000, 500000, 1000000];
				var lifeTimes = [2, 4, 2, 4, 2, 4, 5, 5, 10];
				var minSizeOrders = [1.0, 1.0, 0.0, 0.0, -1.0, -1.0, -1.5, -2.0, -2.0];
				
				var i = parseInt(e.keyCode)-49;
				Demo.rate = rates[i];
				Demo.lifeTime = lifeTimes[i];
				var minSizeOrder = minSizeOrders[i];
				var maxSizeOrder = minSizeOrder+2.0;
				Demo.gl.uniform1f(Demo.rateLoc, Demo.rate);
				Demo.gl.uniform1f(Demo.lifeTimeLoc, Demo.lifeTime);
				Demo.gl.uniform1f(Demo.minSizeOrderLoc, minSizeOrder);
				Demo.gl.uniform1f(Demo.maxSizeOrderLoc, maxSizeOrder);
			}
			if(e.keyCode==16) Demo.speed *= 1.1; //shift
			if(e.keyCode==17) Demo.speed /= 1.1; //control
			if(Demo.speed>0 && e.keyCode==37 || Demo.speed<0 && e.keyCode==39) Demo.speed = -Demo.speed; //left or right
			if(e.keyCode==38) Demo.upPressed = true;
			if(e.keyCode==40) Demo.downPressed = true;
			if(e.keyCode==80) Demo.paused = !Demo.paused;
			if(e.keyCode==115)
			{
				if(Demo.canvas.requestFullScreen) Demo.canvas.requestFullScreen();
				else if(Demo.canvas.webkitRequestFullScreen) Demo.canvas.webkitRequestFullScreen();
				else Demo.canvas.mozRequestFullScreen();
			}
		};
		
		window.onkeyup = function(e)
		{
			if(e.keyCode==38) Demo.upPressed = false;
			if(e.keyCode==40) Demo.downPressed = false;
		};
		
		
		
		this.OnWindowResize();
	},
	
	Step : function(dt)
	{
		var delta = dt;
		this.absTime += dt;

		if(this.upPressed) delta *= 5;
		else if(this.downPressed) delta *= -5;
		else if(this.paused) delta = 0;

		var s = Math.cos(this.absTime*0.23+0.9)*1.5-0.5;
		this.time += delta*this.speed*(1.0 + s + s*s*0.5 + s*s*s*0.167 + s*s*s*s*0.04);
		if(this.time<0) this.time = 0;
	},
}

var RenderFrame = function()
{
	Demo.gl.clear(Demo.gl.COLOR_BUFFER_BIT);

	Demo.worldViewMatrix = TranslationMatrix([0, 0, -7]).x(RotationMatrixDeg(Demo.time*20, [0.1, 0.9, 0]));
	SetMatrixUniform(Demo.gl, Demo.progId, "WorldViewMatrix", Demo.worldViewMatrix);
	Demo.gl.uniform1f(Demo.timeLoc, Demo.time);

	Demo.gl.enableVertexAttribArray(0);
	var particleCount = Math.floor(Math.min(Demo.time, Demo.lifeTime)*Demo.rate);
	var numBatches = Math.ceil(particleCount/16384);
	for(var i=0; i<numBatches; i++)
	{
		Demo.gl.uniform1f(Demo.startIndexLoc, i*16384);
		Demo.gl.drawArrays(Demo.gl.POINTS, 0, Math.min(particleCount, 16384));
		particleCount -= 16384;
	}
	Demo.gl.disableVertexAttribArray(0);
};

var gPrevTime;
function DemoMainLoop()
{
	var now = new Date().getTime();
    var dt = now - (gPrevTime || now);
	gPrevTime = now;
	
	Demo.Step(dt/1000);
	RenderFrame();
	window.requestAnimFrame(DemoMainLoop);
    time = now;
};
