var colorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];
var barChart = dc.barChart("#bar-chart");
var pieChart = dc.pieChart("#pie-chart");
var bubbleChart = dc.bubbleChart("#bubble-chart");

function update_barChart(bar_axis, barChart, facts, data){

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/
  var barValue = facts.dimension(function (d) {
    return d[bar_axis];       // group or filter by magnitude
  });
  var barCount = barValue.group()
    .reduceCount(function(d) { return d[bar_axis]; });

  // Bar Graph
  barChart.width(450)
    .height(200)
    .dimension(barValue)                // the values across the x axis
    .group(barCount)              // the values on the y axis
    .brushOn(true)
    .transitionDuration(500)
    .xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal())
    .elasticY(true)
    .xAxisLabel(bar_axis)
    .yAxisLabel("Count")
    .ordering(function(d) { return -d.value; });
}

function update_pieChart(color_axis, color_scale, pieChart, facts, data){

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/
  var pieValue = facts.dimension(function (d) {
    return d[color_axis];       // group or filter by magnitude
  });

  var pieCount = pieValue.group()
    .reduceCount(function(d) { return d[color_axis]; });

  pieChart 
    .width(400)
    .height(200)
    .radius(100)
    .innerRadius(30)
    .dimension(pieValue)
    .group(pieCount)
    .transitionDuration(500)
    .ordinalColors(colorList)
    .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5));
}

function update_bubble(xColumn, yColumn, color_scale, bubbleChart, facts, data, bar_axis){

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/
  var bubbleValue = facts.dimension(function (d){
    return [d[xColumn], d[yColumn]];
  });

  var bubbleGroup = bubbleValue.group().reduce(
      function (p, d){
        p.count ++;
        p.xSum += d[xColumn];
        p.ySum += d[yColumn];
        p.xColumn = p.xSum / parseFloat(p.count);
        p.yColumn = p.ySum / parseFloat(p.count);
        p.color += d[bar_axis[0]];
        p.size += d[bar_axis[1]];
        return p;
      },
      function (p, d){
        p.count --;
        p.xSum -= d[xColumn];
        p.ySum -= d[yColumn];
        p.xColumn = p.count==0? 0: p.xSum / parseFloat(p.count);
        p.yColumn = p.count==0? 0: p.ySum / parseFloat(p.count);
        p.color = "";
        p.size = 0;
        return p;
      },
      function (p, d){
        return {count:0, xSum:0, ySum:0, xColumn:0, yColumn:0, color:"", size:0};
      }
     );

    // bubble chart
      bubbleChart.width(700)
	.height(550)
	.margins({top: 10, right: 10, bottom: 50, left: 60})
	.dimension(bubbleValue)
	.group(bubbleGroup)
	.transitionDuration(500)
	.colors(color_scale)
	.colorAccessor(function (p) {
		return p.value.color;
	    })
	.keyAccessor(function (p) {
		return p.value.xColumn;
	    })
	.valueAccessor(function (p) {
		return p.value.yColumn;
	    })
	.radiusValueAccessor(function (p) {
		return 1.0;
	    })
	.minRadius(1)
	.maxBubbleRelativeSize(0.010)
	.x(d3.scale.linear().domain([d3.min(data, function(d){return d[xColumn];}), d3.max(data, function(d){return d[xColumn];})]))
	.y(d3.scale.linear().domain([d3.min(data, function(d){return d[yColumn];}), d3.max(data, function(d){return d[yColumn];})]))
	.r(d3.scale.linear().domain([0.5,1]))
	.yAxisLabel(yColumn)
	.xAxisLabel(xColumn)
	.renderHorizontalGridLines(true)
	.renderVerticalGridLines(true);
}

function resetAll(){
  bubbleChart.filterAll();
  barChart.filterAll();
  pieChart.filterAll();
  dc.redrawAll();
}

function plot(dataset){

  d3.json("metadata_"+dataset+".json", function(error, data) {
      n_scatter = data["number of numerical data"];
      n_bar = data["number of category data"];
      scatter_axis = data["numerical"];
      bar_axis = data["category"];
      color_axis = "Type";

      var selectX = document.getElementById("selectX");
      selectX.options.length=0;
      var optionsX = scatter_axis;
      for(var i = 0; i < optionsX.length; i++) {
          var opt = optionsX[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectX.appendChild(el);
      }

      var selectY = document.getElementById("selectY");
      selectY.options.length=0;
      var optionsY = scatter_axis;
      for(var i = 0; i < optionsY.length; i++) {
          var opt = optionsY[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==1)
            el.selected = true;
          selectY.appendChild(el);

      }

      var selectBar = document.getElementById("selectBar");
      selectBar.options.length=0;
      var optionsBar = bar_axis;
      for(var i = 0; i < optionsBar.length; i++) {
          var opt = optionsBar[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectBar.appendChild(el);

      }


      // load data from a csv file
      d3.csv("data_"+dataset+".csv", function (data) {

      /****************************************
      *   Run the data through crossfilter    *
      ****************************************/

        data.forEach(function(d){
          for(var i = 0; i<n_scatter; i++){
            d[scatter_axis[i]] = +d[scatter_axis[i]];
          }
          return d;
        });

        var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

        if(dataset=="facebook"){
	    var color_scale = d3.scale.ordinal()
	      .domain(["Link","Photo","Status","Video"]).range(colorList);
        }else if(dataset=="wine"){
	    var color_scale = d3.scale.ordinal()
	      .domain(["red","white"]).range([colorList[0], colorList[1]]);
        }

        // for bar plot
        update_barChart(bar_axis[0], barChart, facts, data);

        // for pie plot
        update_pieChart(color_axis, color_scale, pieChart, facts, data);
        
        //bubble chart
        update_bubble(scatter_axis[0], scatter_axis[1], color_scale, bubbleChart, facts, data, bar_axis);

        dc.renderAll();

        d3.select('#selectX')
         .on('change', function(){ 
	  resetAll();
          var e = d3.select("#selectY").node(); 
          var optionY = e.value;
          update_bubble(this.value, optionY, color_scale, bubbleChart, facts, data, bar_axis);
          dc.redrawAll(); });

        d3.select('#selectY')
         .on('change', function(){ 
	  resetAll();
          var e = d3.select("#selectX").node(); 
          var optionX = e.value;
          update_bubble(optionX, this.value, color_scale, bubbleChart, facts, data, bar_axis);
          dc.redrawAll(); });

        d3.select('#selectBar')
         .on('change', function(){ 
	  resetAll();
          update_barChart(this.value, barChart, facts, data);
          dc.redrawAll(); });
      });
  });
}


plot("facebook");
 
