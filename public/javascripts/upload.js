console.log("upload.js is loaded")
function plot(){$.getJSON("/json", function(json) {
	alert("whgiwh");
    //console.log(json); // this will show the info it in firebug console
	console.log(json["groups"][0]["peaks"][0]["sampleName"])
	var data1=[]
	var data2=[]
	var data3=[]
	for(i=0;i<json["groups"][0]["peaks"][0]["eic"]["rt"].length;i++){
		data1.push({"rt":json["groups"][0]["peaks"][0]["eic"]["rt"][i], "intensity":json["groups"][0]["peaks"][0]["eic"]["intensity"][i]});
	}
	for(i=0;i<json["groups"][0]["peaks"][1]["eic"]["rt"].length;i++){
		data2.push({"rt":json["groups"][0]["peaks"][1]["eic"]["rt"][i], "intensity":json["groups"][0]["peaks"][1]["eic"]["intensity"][i]});
	}
	for(i=0;i<json["groups"][0]["peaks"][2]["eic"]["rt"].length;i++){
		data3.push({"rt":json["groups"][0]["peaks"][2]["eic"]["rt"][i], "intensity":json["groups"][0]["peaks"][2]["eic"]["intensity"][i]});
	}
	console.log(data1)
	console.log(data2)
	console.log(data3)
	var vis = d3.select("#visualisation"),
                        WIDTH = 1000,
                        HEIGHT = 500,
                        MARGINS = {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 50
                        },
                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 15]),
                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 100000000]),
                        xAxis = d3.svg.axis()
                        .scale(xScale),
                        yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");
                    
                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);
                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);
                    var lineGen = d3.svg.line()
                        .x(function(d) {
                            return xScale(d.rt);
                        })
                        .y(function(d) {
                            return yScale(d.intensity);
                        })
                        .interpolate("basis");
                    vis.append('svg:path')
                        .attr('d', lineGen(data1))
                        .attr('stroke', 'green')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                    vis.append('svg:path')
                        .attr('d', lineGen(data2))
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
					vis.append('svg:path')
                        .attr('d', lineGen(data3))
                        .attr('stroke', 'red')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                
});
}
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

