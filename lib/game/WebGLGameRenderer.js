(function() {
	var _fragmentShaderCode = "precision lowp float;" +
		"varying vec4 vColor;" + 
		"void main(void) {" +
		"gl_FragColor = vColor;" +
		"}";

	var _vertexShaderCode = "attribute vec3 aVertexPosition;" +
		"attribute vec2 aOffsets;" +
		"attribute vec2 aVertexCenter;" +
		"attribute vec4 aVertexColor;" +
		"uniform mat4 uMVMatrix;" +
		"uniform mat4 uPMatrix;" +
		"varying vec4 vColor;" +
		"void main(void) {" +
		"float diffX = aVertexPosition.x - aVertexCenter.x;" +
		"float offsetX = (aOffsets.x * diffX) - diffX;" +
		"float diffY = aVertexPosition.y - aVertexCenter.y;" +
		"float offsetY = (aOffsets.y * diffY) - diffY;" +
		"float offsetZ = 0.0;" +
		"if(offsetX != 0.0 || offsetY != 0.0) {" +
		"offsetZ = 0.1;" +
		"}" +
		"gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(offsetX, offsetY, offsetZ), 1.0);" +
		"vColor = aVertexColor;" + 
		"}";

	L7.WebGLGameRenderer = function(viewport) {
		this.viewport = viewport;
	};

	L7.WebGLGameRenderer.prototype = {
		_getShader: function(src, type) {
			var shader = this.gl.createShader(type);

			this.gl.shaderSource(shader, src);
			this.gl.compileShader(shader);

			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				throw new Error(this.gl.getShaderInfoLog(shader));
			}

			return shader;
		},

		_initShaders: function() {
			var fragmentShader = this._getShader(_fragmentShaderCode, this.gl.FRAGMENT_SHADER);
			var vertexShader = this._getShader(_vertexShaderCode, this.gl.VERTEX_SHADER);

			var shaderProgram = this.gl.createProgram();
			this.gl.attachShader(shaderProgram, vertexShader);
			this.gl.attachShader(shaderProgram, fragmentShader);
			this.gl.linkProgram(shaderProgram);

			if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
				throw new Error("Could not initialise shaders");
			}

			this.gl.useProgram(shaderProgram);

			this.gl.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
			this.gl.enableVertexAttribArray(this.gl.vertexPositionAttribute);

			this.gl.offsetsAttribute = this.gl.getAttribLocation(shaderProgram, "aOffsets");
			this.gl.enableVertexAttribArray(this.gl.offsetsAttribute);

			this.gl.centerPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexCenter");
			this.gl.enableVertexAttribArray(this.gl.centerPositionAttribute);

			this.gl.vertexColorAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexColor");
			this.gl.enableVertexAttribArray(this.gl.vertexColorAttribute);

			this.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");
			this.gl.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uMVMatrix");
		},

		init: function(canvas) {
			this.gl = canvas.getContext('experimental-webgl');

			this.gl.clearColor(0, 0, 0, 1);
			this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    	this.gl.enable(this.gl.BLEND);
      this.gl.enable(this.gl.DEPTH_TEST);
			
			this.pMatrix = mat4.create();

			this._initShaders();
		},

		renderFrame: function(canvas, board, delta, anchorXpx, anchorYpx, timestamp) {
			this.gl.viewport(0, 0, this.viewport.width, this.viewport.height);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			mat4.ortho(0, this.viewport.width, this.viewport.height, 0, -100, 100, this.pMatrix);
			this.gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);

			board.render(delta, this.gl, anchorXpx, anchorYpx, timestamp);
		}
	};
})();

