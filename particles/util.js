
function IsEmptyString(str)
{
	return str=="" || /^\s+$/.test(str);
}

function CompileShader(gl, code, type)
{
	var sh = gl.createShader(type);
	gl.shaderSource(sh, code);
	gl.compileShader(sh);
	var log = gl.getShaderInfoLog(sh);
	if(!IsEmptyString(log)) console.log(log);
	return sh;
}

function LinkShaderProgram(gl, vertexShaderId, fragmentShaderId)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vertexShaderId);
	gl.attachShader(prog, fragmentShaderId);
	gl.linkProgram(prog);
	gl.useProgram(prog);
	var log = gl.getProgramInfoLog(prog);
	if(!IsEmptyString(log)) console.log(log);
	return prog;
}

function CompileShaderProgram(gl, vertexCode, fragmentCode)
{
	return LinkShaderProgram(gl, CompileShader(gl, vertexCode, gl.VERTEX_SHADER), CompileShader(gl, fragmentCode, gl.FRAGMENT_SHADER));
}

function RotationMatrixDeg(angle, axis) 
{
	var arad = angle*Math.PI/180.0;
	return Matrix.Rotation(arad, $V([axis[0], axis[1], axis[2]])).ensure4x4();
}

function TranslationMatrix(vec)
{
	return Matrix.Translation($V([vec[0], vec[1], vec[2]])).ensure4x4();
}

function SetMatrixUniform(gl, programId, name, mat)
{
    var loc = gl.getUniformLocation(programId, name);
    gl.uniformMatrix4fv(loc, false, new Float32Array(mat.flatten())); 
}



window.requestAnimFrame = window.requestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 16.67);
              };
 
