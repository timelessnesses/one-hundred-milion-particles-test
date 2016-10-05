var ParticleKinematics = "return origin + startVelocity*t + Acceleration*t*t*0.5;";
var EmitterRotation = "return EmitterRotationVelocity*t+EmitterRotationAcceleration*t*t/2;";
var SomeEmitterTrajectoryFunction = "return vec3(sin(t*5.0)*3.1-1.5, -1.0+sin(t*4.0)*2.6, sin(t*1.6+0.23)*2.5-1.0);";
var SomeEmitterRotationFunction = "return vec3(8.0,29.5,-1.0)*t*cos(t*3.0);";

var SomeColorFunction =
		"vec3 mainColor = mix( f3rand(vec2(floor(birthTime*4.0), 42.1)), f3rand(vec2(floor(birthTime*4.0+1.0), 58.3)), fract(birthTime*4.0) )*8.0;\
		vec3 startColor = f3rand(vec2(birthTime, 342.1))*0.03;\
		vec3 finalColor = f3rand(vec2(birthTime, 39.6));\
		return vec4( mix(startColor, finalColor, factor)*mainColor, (1.0-factor)*(1.0-factor) );";

var SomeSizeFunction =
	"float scale = exp(mix(MinSizeOrder, MaxSizeOrder, frand(vec2(birthTime, 5.3))));\
	float startSize = frand(vec2(birthTime, 85.3))*0.04*scale;\
	float finalSize = frand(vec2(birthTime, 123.5))*0.1*scale;\
	return mix(startSize, finalSize, pow(factor, 0.7));";

var SomeParticleTrajectoryFunction = "return origin + startVelocity*t + vec3(0.0, 0.58*t*t*0.5, 0.0);";

var SomeEmitterFunction =
		"float speed = mix(0.5, 3.35, frand(vec2(t, 0.0)));\
		vec3 rotation = mix(vec3(-0.7,-0.3,-0.7), vec3(0.7,0.3,0.7), f3rand(vec2(t, 12.3)));\
		velocity = RotationEulerMatrix(rotation)*vec3(speed, 0.0, 0.0);\
		origin = (f3rand(vec2(t, 10.0))*2.0-1.0)*0.2;";


function ParticleEffectDescToShader(gl, desc)
{
	var vertexShaderCode = desc.VertexTemplateCode
		.replace('${GetColor_Body}', desc.ColorFunction)
		.replace('${GetSize_Body}', desc.SizeFunction)
		.replace('${GetPosition_Body}', desc.PositionFunction)
		.replace('${GetEmitterPosition_Body}', desc.EmitterPositionFunction)
		.replace('${GetEmitterRotationAngles_Body}', desc.EmitterRotationFunction)
		.replace('${GetStartParameters_Body}', desc.StartParametersFunction);
		
	return CompileShaderProgram(gl, vertexShaderCode, desc.FragmentShaderCode);
}

