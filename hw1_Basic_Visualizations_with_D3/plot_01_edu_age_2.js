(function(){
var outerWidth = 650;
var outerHeight = 400;
var margin = { left: 80, top: 60, right: 30, bottom:80 };

var xColumn = "AverageAge";
var yColumn = "AverageEdu";

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("#line_edu_age").append("svg")
  .attr("width",  outerWidth)
  .attr("height", outerHeight);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.linear().range([0, innerWidth]);
var yScale = d3.scale.linear().range([innerHeight, 0]);

var xAxisG = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + innerHeight + ")");

var yAxisG = g.append("g")
  .attr("class", "y-axis");

var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

var color = ["#3366cc", "#dc3912", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
      

function render(data){

  xScale.domain([18, d3.max(data, function (d){ return d[xColumn]; })]);
  yScale.domain([8.5, d3.max(data, function (d){ return d[yColumn]; })]);


  xAxisG.call(xAxis);
  xAxisG.call(xAxis);

  xAxisG.append("text")
    .attr("class", "xlabel")
    .attr("x", innerWidth/2)
    .attr("y", margin.bottom/2)
    .style("text-anchor", "middle")
    .style("font-size", "12.5pt")
    .text("Age");

  yAxisG.call(yAxis);

  yAxisG.append("text")
    .attr("class", "ylabel")
    .attr("x", -innerHeight/2)
    .attr("y", -margin.left/2)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "12.5pt")
    .text("Education Level");

  g.selectAll(".dot")
    .data(data)
	.enter().append("circle")
	  .attr("class", "dot")
	  .attr("r", 5)
	  .attr("cx", function(d){ return xScale(d[xColumn]);})
	  .attr("cy", function(d){ return yScale(d[yColumn]);})
	  .style("fill", color[0]);
  
  var line1 = d3.svg.line()
	.x(function(d) { return xScale(d[xColumn]); })
	.y(function(d) { return yScale(d["EduFitiOrder1"]); });

  var line2 = d3.svg.line()
	.x(function(d) { return xScale(d[xColumn]); })
	.y(function(d) { return yScale(d["EduFitiOrder2"]); });

  var line3 = d3.svg.line()
  .x(function(d) { return xScale(d[xColumn]); })
  .y(function(d) { return yScale(d["EduFitiOrder3"]); });

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color[1])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color[2])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line2);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color[3])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line3);


  var legends = g.append("g")
    .attr("class","legend")
    .attr("transform", "translate(" + innerWidth*2/3 + "," + innerHeight*2/3 + ")")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 100)
    .attr("width", 100);

  legends.append("rect")
    .attr("x",  0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[0])

  legends
    .append("text")
	.attr("x", 15)
    .attr("y", 10)
    .text("Education Score")
    .style("text-anchor", "front");

  legends.append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[1])

  legends
    .append("text")
	.attr("x", 15)
    .attr("y", 30)
    .text("Linear Fit")
    .style("text-anchor", "front");

  legends.append("rect")
    .attr("x", 0)
    .attr("y", 40)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[2])

  legends
    .append("text")
	.attr("x", 15)
    .attr("y", 50)
    .text("Quadratic Fit")
    .style("text-anchor", "front");

  legends.append("rect")
    .attr("x", 0)
    .attr("y", 60)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[3])

  legends
    .append("text")
  .attr("x", 15)
    .attr("y", 70)
    .text("Qubic Fit")
    .style("text-anchor", "front");

}

d3.csv("data_01_edu_age_2.csv", function(data) {
  //make the data numeric
  data.forEach(function(d){
    var keys = d3.keys(d);
    for(var i = 1, n = keys.length; i<n; i++){
      d[keys[i]] = +d[keys[i]];
    }
    return d;
  });

  render(data);
});
})();