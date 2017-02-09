var Plot_edu_age_1 = function(){
  var outerWidth = 650;
  var outerHeight = 500;
  var margin = { left: 80, top: 60, right: 30, bottom:130 };

  var xColumn = "EduLevel";
  var yColumns = [">=18","18-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74",">=75"];

  var innerWidth  = outerWidth  - margin.left - margin.right;
  var innerHeight = outerHeight - margin.top  - margin.bottom;

  var svg = d3.select("#bar_edu_age").append("svg")
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

  function plot_axis(data){
    xScale.domain(data.map( function (d){ return d[xColumn]; }));
    yScale.domain([0, 0.4]);

    xAxisG.call(xAxis);
    xAxisG
      .selectAll("text")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    yAxisG.call(yAxis);

    yAxisG.append("text")
      .attr("class", "ylabel")
      .attr("x", -innerHeight/2)
      .attr("y", -margin.left*2/3)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-size", "12.5pt")
      .text("Proportion of People by Education");
  }

  function render(data, i){

    xScale.domain(data.map( function (d){ return d[xColumn]; }));
    yScale.domain([0, 0.4]);

    var bars = g.selectAll(".bars").data(data);

    bars.exit()
      .transition()
      .attr("y", yScale(0))
      .attr("height", innerHeight - yScale(0))
      .style('fill-opacity', 1e-6)
      .remove();

    bars.enter().append("rect")
      .attr("class", "bars")
      .attr("x", function (d){ return xScale(d[xColumn]); })
      .attr("width", xScale.rangeBand())
      .attr("y", yScale(0))
      .attr("height", innerHeight - yScale(0))
      .attr("fill", "steelblue");

    bars
      .transition()
      .attr("x", function (d){ return xScale(d[xColumn]); })
      .attr("width", xScale.rangeBand())
      .attr("y", function (d){ return yScale(d[yColumns[i]]); })
      .attr("height", function (d){ return innerHeight - yScale(d[yColumns[i]]); })
      .attr("fill", "steelblue");

    // bars.exit().remove();
      
    var legends = g.append("g")
      .attr("class","legend")
      .attr("transform", "translate(" + 20 + "," + 20 + ")")
      .attr("x", 15)
      .attr("y", 25)
      .attr("height", 100)
      .attr("width", 100);

    legends.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "steelblue" );

    var text = g.select(".legend").selectAll("text").data([yColumns[i]]);

    text.enter().append("text");

    text
      .attr("x", 15)
      .attr("y", 10)
      .text(function(d){return "age "+d;})
      .style("text-anchor", "front");

    text.exit().remove();
  }

  d3.csv("data_01_edu_age_1.csv", function(data) {
    //make the data numeric
    data.forEach(function(d){
      var keys = d3.keys(d);
      for(var i = 1, n = keys.length; i<n; i++){
        d[keys[i]] = +d[keys[i]];
      }
      return d;
    });

    plot_axis(data);
    render(data, 0);
  // setTimeout(function(){ render(data, 1) }, 1000);
  // setTimeout(function(){ render(data, 2) }, 2000);
  // setTimeout(function(){ render(data, 1) }, 3000);
  });

  var public={
    plot: function (index) {
      d3.csv("data_01_edu_age_1.csv", function(data) {
        //make the data numeric
        data.forEach(function(d){
          var keys = d3.keys(d);
          for(var i = 1, n = keys.length; i<n; i++){
            d[keys[i]] = +d[keys[i]];
          }
          return d;
        });

        // plot_axis(data);
        render(data, index);
      // setTimeout(function(){ render(data, 1) }, 1000);
      // setTimeout(function(){ render(data, 2) }, 2000);
      // setTimeout(function(){ render(data, 1) }, 3000);
      });
    }
  };

  return public;
}();
