function getPixelData(imageData, index) {
	var offset = index * 4;
	var data = [];
	for (var i = offset; i < offset + 4; ++i) {
		data.push(imageData[i]);
	}

	return data;
}

function eq(a, b) {
	return _.isEqual(a, b);
}


