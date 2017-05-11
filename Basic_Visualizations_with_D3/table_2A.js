var outerWidth = 600;
var outerHeight = 400;
var margin = { left: 80, top: 30, right: 30, bottom: 90 };

var xColumn = "EduLevel";
var yColumn = "Number";

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("#tab2A_Number").append("svg")
  .attr("width",  outerWidth)
  .attr("height", outerHeight);
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], 0.2);
var yScale = d3.scale.linear().range([innerHeight, 0]);

var xAxisG = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
  .attr("class", "y-axis");

var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

function render(data){

  xScale.domain(       data.map( function (d){ return d[xColumn]; }));
  yScale.domain([0, d3.max(data, function (d){ return d[yColumn]/1000; })]);

  xAxisG.call(xAxis);
  xAxisG
  	.selectAll("text")
  	.attr("dx", "-.8em")
  	.attr("dy", ".25em")
   	.attr("transform", "rotate(-30)")
  	.style("text-anchor", "end");

  yAxisG.call(yAxis);

  var bars = g.selectAll("rect").data(data);
  bars.enter().append("rect");

  bars
    .attr("x", function (d){ return xScale(d[xColumn]); })
    .attr("y", function (d){ return yScale(d[yColumn]/1000); })
    .attr("width", xScale.rangeBand())
    .attr("height", function (d){ return innerHeight - yScale(d[yColumn]/1000); })
    .attr("fill", "steelblue");

  bars.exit().remove();

  g.append("text")
  	.attr("x", -innerHeight/2)
  	.attr("y", -margin.left/2)
  	.attr("transform", "rotate(-90)")
  	.style("text-anchor", "middle")
  	.style("font-size", "12.5pt")
  	.text("Number of People (in millions)");
}

function type(d){
  // for(var i = 1, n = Object.keys(d[0]).length; i<n; i++)
  d.Number = +d.Number;
  return d;
}

d3.csv("data_2A_2J.csv", type, render);