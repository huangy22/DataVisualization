(function(){
var outerWidth = 650;
var outerHeight = 400;
var margin = { left: 80, top: 60, right: 30, bottom:130 };

var xColumn = "Income_median";
var yColumn = "Months Worked";
var yFit = "IncomeMonthFit";

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("#line_income_working").append("svg")
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

  data.sort(function(a, b){
    return a[xColumn]-b[xColumn];
  });

  xScale.domain([d3.min(data, function(d){return d[xColumn];}), d3.max(data, function(d){return d[xColumn];})]);
  yScale.domain([0, d3.max(data, function (d){ return d[yColumn]; })]);


  xAxisG.call(xAxis);
    xAxisG
      .selectAll("text")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

  xAxisG.append("text")
    .attr("class", "ylabel")
    .attr("x", innerWidth/2)
    .attr("y", margin.bottom/2)
    .style("text-anchor", "middle")
    .style("font-size", "12.5pt")
    .text("The Median of Total Monthly Income");

  yAxisG.call(yAxis);

  yAxisG.append("text")
    .attr("class", "ylabel")
    .attr("x", -innerHeight/2)
    .attr("y", -margin.left/2)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "12.5pt")
    .text("Months Worked in Preceding 4 months");

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
	.y(function(d) { return yScale(d[yColumn]); });

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color[0])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);


  var line2 = d3.svg.line()
  .x(function(d) { return xScale(d[xColumn]); })
  .y(function(d) { return yScale(d[yFit]); });

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color[1])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line2);


  var legends = g.append("g")
    .attr("class","legend")
    .attr("transform", "translate(" + innerWidth/3 + "," + innerHeight*2/3 + ")")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 100)
    .attr("width", 100);
    
  legends.append("rect")
    .attr("x",  0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[0]);

  legends
    .append("text")
	.attr("x", 15)
    .attr("y", 10)
    .text("Months Worked")
    .style("text-anchor", "front");

  legends.append("rect")
    .attr("x",  0)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color[1]);

  legends
    .append("text")
  .attr("x", 15)
    .attr("y", 30)
    .text("Linear Regression: y = 1.967+0.242*(x/1000)")
    .style("text-anchor", "front");
}

d3.csv("data_2A_2J.csv", function(data) {
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