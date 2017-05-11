(function(){
var outerWidth = 850;
var outerHeight = 500;
var margin = { left: 280, top: 60, right: 30, bottom:90 };

var xColumn = "EduLevel";
var group = ["female", "male"]

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("#bar_edu_sex").append("svg")
  .attr("width",  outerWidth)
  .attr("height", outerHeight);
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xfScale = d3.scale.linear().range([innerWidth/2, 0]);
var xmScale = d3.scale.linear().range([innerWidth/2, innerWidth]);
var yScale = d3.scale.ordinal().rangeBands([innerHeight, 0], 0.1);

var xfAxisG = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0, "+ innerHeight + ")");

var xmAxisG = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0, "+ innerHeight + ")");

var yAxisG = g.append("g")
  .attr("class", "y-axis");

var xfAxis = d3.svg.axis().scale(xfScale).orient("bottom");
var xmAxis = d3.svg.axis().scale(xmScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

function render(data){

  xfScale.domain([0, d3.max(data, function (d){ return d[group[0]]+0.01; })]);
  xmScale.domain([0, d3.max(data, function (d){ return d[group[0]]+0.01; })]);
  yScale.domain(       data.map( function (d){ return d[xColumn];}));

  xfAxisG.call(xfAxis);
  xmAxisG.call(xmAxis);

  yAxisG.call(yAxis);

  yAxisG.append("text")
    .attr("class", "ylabel")
    .attr("x", innerHeight/2)
    .attr("y", innerHeight+margin.bottom/2)
    .style("font-size", "12.5pt")
    .text("Proportion of People by Education");

  g.selectAll(".redbars").data(data)
    .enter()
    .append("rect")
    .attr("class", "redbars")
    .attr("y", function (d){ return yScale(d[xColumn]); })
    .attr("height", yScale.rangeBand())
    .attr("x", function (d){ return xfScale(d[group[0]]); })
    .attr("width", function (d){ return  innerWidth/2 -xfScale(d[group[0]]); })
    .attr("fill", "red")

  g.selectAll(".bluebars").data(data)
    .enter()
    .append("rect")
    .attr("class", "bluebars")
    .attr("y", function (d){ return yScale(d[xColumn]); })
    .attr("height", yScale.rangeBand())
    .attr("x", function (d){ return innerWidth/2; })
    .attr("width", function (d){ return  xmScale(d[group[1]])-innerWidth/2; })
    .attr("fill", "steelblue");

    
  var legends = g.append("g")
    .attr("class","legend")
    .attr("transform", "translate(0 ," +  250 + ")")
    .attr("x", 50)
    .attr("y", 0)
    .attr("width", innerWidth-100)
    .attr("height", margin.bottom);

  legends.append("rect")
    .attr("x", innerWidth/2 -115)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "red" );

  legends.append("text")
    .attr("x", innerWidth/2 - 50)
    .attr("y", 10)
    .style("text-anchor", "end")
    .text(function(d){return "female";})
    .style("text-anchor", "end");

  legends.append("rect")
    .attr("x", innerWidth/2 +50)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "steelblue" );

  legends.append("text")
    .attr("x", innerWidth/2 + 100)
    .attr("y", 10)
    .style("text-anchor", "front")
    .text(function(d){return "male";})
    .style("text-anchor", "end");
}

d3.csv("data_01_edu_sex.csv", function(data) {
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