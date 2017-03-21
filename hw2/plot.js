
var colorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];
var barChart = dc.barChart("#bar-chart");
var pieChart = dc.pieChart("#pie-chart");
var bubbleChart = dc.bubbleChart("#bubble-chart");
var heatMap = dc.heatMap("#heatmap");
var heatLegend = dc.heatMap("#heat-legend");
var lineChart = dc.lineChart("#line-chart");


function show(id) {
  var e = document.getElementById(id);
  e.style.display = 'block';
}

function hide(id) {
  var e = document.getElementById(id);
  e.style.display = 'none';
}

function resetAll(){
  var charts = dc.chartRegistry.list();
  for(var i=0; i<charts.length; i++){
    charts[i].filterAll();
  }
  dc.redrawAll();
}

function update_title(fig, title){
  var h = document.createElement('h5');
  var t = document.createTextNode(title);
  h.appendChild(t);
  var myNode = document.getElementById("title-"+fig);
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  myNode.appendChild(h); 
}

function remove_title(fig){
  var myNode = document.getElementById("title-"+fig);
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

function update_heatmap(x_axis, y_axis, value_axis, heatMap, heatLegend, facts, data){

  heatMap.filterAll();
  heatLegend.filterAll();

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/
  var xyDimension = facts.dimension(function (d) {
    var dict = {'Mon': '7', 'Tue': '6', 'Wed': '5','Thu':'4', 'Fri': '3', 'Sat': '2', 'Sun': '1'};
    return [+d[x_axis], dict[d[y_axis]]+". "+d[y_axis]];       // group or filter by magnitude
  });

  var heatGroup = xyDimension.group().reduce(
      function (p, d){
        p.count ++;
        p.sum += d[value_axis];
        p.average = p.sum / parseFloat(p.count);
        return p;
      },
      function (p, d){
        p.count --;
        p.sum -= d[value_axis];
        p.average = p.count==0? 0: p.sum / parseFloat(p.count);
        return p;
      },
      function (p, d){
        return {count:0, sum:0, average:0};
      }
     );

  var color_map = data.map(function(d){return d[value_axis];});

  var minValue = d3.min(data, function(d){return d[value_axis];});
  var maxValue = d3.max(data, function(d){return d[value_axis];});

  // Bar Graph
  heatMap.width(600)
    .height(200)
    .dimension(xyDimension)                // the values across the x axis
    .group(heatGroup)              // the values on the y axis
    .colors(["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
    .keyAccessor(function(d) { return d.key[0]; })
    .valueAccessor(function(d) { return d.key[1]; })
    .colorAccessor(function(d) { return +d.value.average; })
    .title(function(d) {
        return "Hour    : " + d.key[0] + "\n" +
               "Weekday : " + d.key[1] + "\n" +
               value_axis+" (Average) : " + Math.round(d.value.average*100)/100;})
    .colorDomain([minValue, maxValue])
    .rowsLabel(function (v) {
      return v.split(".")[1];
      });

  var range = maxValue - minValue;

  var heatArr = [];
  for (var i = 0; i < 8; i++) {
    heatArr.push({
      val: minValue + i / 7 * range,
      index: i
    });
  }

  var ndx = crossfilter(heatArr);

  var keyHeatmap = ndx.dimension(function(d) {
    return [d.index, 1];
  });

  var keyHeatmapGroup = keyHeatmap.group().reduceSum(function(d) {
    return d.val;
  });

  heatLegend.width(600)
        .height(80)
        .dimension(keyHeatmap)
        .group(keyHeatmapGroup)
        .colorAccessor(function(d) {
          return d.value;
        })
        .keyAccessor(function(d) { return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colsLabel(function(d){
          return heatArr[d].val.toFixed(0);
        })
        .rowsLabel(function(d) {
          return "Value";
        })
        .colors(["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
        .calculateColorDomain()
        .title(function(d) {
          return value_axis+" : " + Math.round(d.value) + " - " + Math.round(d.value+range/7);})
        .on('renderlet', function (chart) {
          chart.selectAll("g.cols.axis text") 
            .attr('dy', '+20') 
            .attr('dx', '-35')
            // .attr("transform", function () { 
            //   var coord = this.getBBox();
            //   var x = coord.x + (coord.width / 2); 
            //   var y = coord.y + (coord.height / 2); 
            //   return "rotate(-45 " + x + " " + y + ")"; }) 
            .style("fill", "black");
        });

  heatLegend.xBorderRadius(0);
  heatLegend.yBorderRadius(0);
}


function update_barChart(bar_axis, barChart, facts, data){

  // var barChart = dc.barChart("#bar-chart");
  barChart.filterAll();

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/
  var barValue = facts.dimension(function (d) {
    if(bar_axis=="Post Weekday"){
        var dict = {'Mon': '1', 'Tue': '2', 'Wed': '3','Thu':'4', 'Fri': '5', 'Sat': '6', 'Sun': '7'};
        return dict[d[bar_axis]]+'.'+d[bar_axis];
    }
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
    .ordering(function(d) { return +d.key; });
}

function update_pieChart(color_axis, pieChart, facts, data){

  pieChart.filterAll();

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
  var color_map = data.map(function(d){return d[color_axis];});

  pieChart 
    .width(460)
    .height(200)
    .radius(80)
    .innerRadius(30)
    .dimension(pieValue)
    .group(pieCount)
    .transitionDuration(500)
    .colors(d3.scale.category10().domain(color_map))
    .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5));
}

function update_lineChart(xColumn, yColumn, lineChart, facts, data){

  lineChart.filterAll();

  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/

  var lineValue = facts.dimension(function (d){
    return  +d[xColumn];
  });

  var lineGroup = lineValue.group().reduce(
      function (p, d){
        p.count ++;
        p.ySum += d[yColumn];
        p.yColumn = p.ySum / parseFloat(p.count);
        return p;
      },
      function (p, d){
        p.count --;
        p.ySum -= d[yColumn];
        p.yColumn = p.count==0? 0: p.ySum / parseFloat(p.count);
        return p;
      },
      function (p, d){
        return {count:0, ySum:0, yColumn:0};
      }
     );

  // var color_map = data.map(function(d){return d[color_axis];});

    // bubble chart
  lineChart.width(500)
    .height(300)
    .margins({top: 10, right: 10, bottom: 50, left: 60})
    .dimension(lineValue)
    .group(lineGroup)
    .brushOn(false)
    .transitionDuration(500)
    .keyAccessor(function (p) {
      return p.key;
        })
    .valueAccessor(function (p) {
      return p.value.yColumn;
        })
    .x(d3.scale.linear().domain([d3.min(data, function(d){return +d[xColumn];}), d3.max(data, function(d){return +d[xColumn];})]))
    .xAxisLabel(xColumn)
    .elasticY(true)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .renderTitle(true)
    .title(function(d){
      return xColumn+": "+d.key +"\n"
      +yColumn+": "+Math.round(d.value.yColumn*100)/100;});
}


function update_bubble(xColumn, yColumn, color_axis, bubbleChart, facts, data){

  bubbleChart.filterAll();
  /******************************************************
  * Create the Dimensions                               *
  * A dimension is something to group or filter by.     *
  * Crossfilter can filter by exact value, or by range. *
  ******************************************************/

  var bubbleValue = facts.dimension(function (d){
    return  [d[xColumn], d[yColumn], d[color_axis]];
  });

  var bubbleGroup = bubbleValue.group().reduce(
      function (p, d){
        p.count ++;
        p.xSum += d[xColumn];
        p.ySum += d[yColumn];
        p.xColumn = p.xSum / parseFloat(p.count);
        p.yColumn = p.ySum / parseFloat(p.count);
        p.color = d[color_axis];
        return p;
      },
      function (p, d){
        p.count --;
        p.xSum -= d[xColumn];
        p.ySum -= d[yColumn];
        p.xColumn = p.count==0? 0: p.xSum / parseFloat(p.count);
        p.yColumn = p.count==0? 0: p.ySum / parseFloat(p.count);
        if(p.count==0){
          p.color = "";
        }
        return p;
      },
      function (p, d){
        return {count:0, xSum:0, ySum:0, xColumn:0, yColumn:0, color:""};
      }
     );

  var color_map = data.map(function(d){return d[color_axis];});

    // bubble chart
  bubbleChart.width(700)
  	.height(450)
  	.margins({top: 10, right: 10, bottom: 50, left: 60})
  	.dimension(bubbleValue)
  	.group(bubbleGroup)
  	.transitionDuration(500)
  	.colors(d3.scale.category10().domain(color_map))
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
  	.renderVerticalGridLines(true)
  	.renderTitle(true)
  	.title(function(d){
  	  return color_axis+": "+d.value.color+"\n"
  	  +xColumn+": "+Math.round(d.value.xColumn*100)/100+"\n"
  	  +yColumn+": "+Math.round(d.value.yColumn*100)/100;});
}


function plot(dataset){

  $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
  });

  heatMap.resetSvg();
  heatLegend.resetSvg();
  lineChart.resetSvg();

  if(dataset=="facebook"){
    if(!dc.hasChart(heatMap)){
      dc.registerChart(heatMap);
      dc.registerChart(heatLegend);
    }
    if(!dc.hasChart(lineChart))
      dc.registerChart(lineChart);
  }else{
    dc.deregisterChart(heatMap);
    dc.deregisterChart(heatLegend);
    dc.deregisterChart(lineChart);
  }


  d3.json("metadata_"+dataset+".json", function(error, data) {
      n_scatter = data["number of numerical data"];
      n_bar = data["number of category data"];
      scatter_axis = data["numerical"];
      bar_axis = data["category"];
      color_axis = data["color"];

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

      var selectColor = document.getElementById("selectColor");
      selectColor.options.length=0;
      var optionsColor = color_axis;
      for(var i = 0; i < optionsColor.length; i++) {
          var opt = optionsColor[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectColor.appendChild(el);
      }

      var selectBar = document.getElementById("selectBar");
      selectBar.options.length=0;
      var optionsBar = bar_axis;
      for(var i = 0; i < optionsBar.length; i++) {
          var opt = optionsBar[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==1)
            el.selected = true;
          selectBar.appendChild(el);
      }

      var selectHeat = document.getElementById("selectHeatValue");
      selectHeat.options.length=0;
      var optionsHeat = scatter_axis;
      for(var i = 0; i < optionsHeat.length; i++) {
          var opt = optionsHeat[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectHeat.appendChild(el);
      }


      var selectXLine = document.getElementById("selectX-line");
      selectXLine.options.length=0;
      var optionsX = ["Post Hour", "Post Month"];
      for(var i = 0; i < optionsX.length; i++) {
          var opt = optionsX[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectXLine.appendChild(el);
      }

      var selectYLine = document.getElementById("selectY-line");
      selectYLine.options.length=0;
      var optionsY = scatter_axis;
      for(var i = 0; i < optionsY.length; i++) {
          var opt = optionsY[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          if(i==0)
            el.selected = true;
          selectYLine.appendChild(el);
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

        // for bar plot
        update_title("bar", "By "+bar_axis[1]);
        update_barChart(bar_axis[1], barChart, facts, data);

        if(dataset=="facebook"){
          // for heatmap
          update_title("heatmap", scatter_axis[0]);
          update_heatmap("Post Hour", "Post Weekday", scatter_axis[0], heatMap, heatLegend, facts, data);
        }else{
          remove_title("heatmap");
        }

        if(dataset=="facebook"){
          // for heatmap
          update_title("line", scatter_axis[0]+ " By "+ "Post Hour");
          update_lineChart("Post Hour", scatter_axis[0], lineChart, facts, data);
        }else{
          remove_title("line");
        }

        // for pie plot
        update_title("pie", "By "+color_axis[0]);
        update_pieChart(color_axis[0], pieChart, facts, data);
        
        //bubble chart
        update_title("bubble", scatter_axis[1]+ " By "+scatter_axis[0]);
        update_bubble(scatter_axis[0], scatter_axis[1], color_axis[0], bubbleChart, facts, data);

      	dc.renderAll();

        d3.select('#selectX-line')
         .on('change', function(){ 
          var e = d3.select("#selectY-line").node(); 
          var optionY = e.value;
          update_title("line", optionY+ " By "+this.value);
          update_lineChart(this.value, optionY, lineChart, facts, data);

          dc.redrawAll();
        });

        d3.select('#selectY-line')
         .on('change', function(){ 
          var e = d3.select("#selectX-line").node(); 
          var optionX = e.value;
          update_title("line", this.value + " By " + optionX);
          update_lineChart(optionX, this.value, lineChart, facts, data);

          dc.redrawAll();
        });


        d3.select('#selectX')
         .on('change', function(){ 
          var e = d3.select("#selectY").node(); 
          var optionY = e.value;
          var optionColor = d3.select("#selectColor").node().value;
          update_title("bubble", optionY+ " By "+this.value);
          update_bubble(this.value, optionY, optionColor, bubbleChart, facts, data);

      	  dc.redrawAll();
    	  });

        d3.select('#selectY')
         .on('change', function(){ 
          var e = d3.select("#selectX").node(); 
          var optionX = e.value;
          var optionColor = d3.select("#selectColor").node().value;
          update_title("bubble", this.value+ " By "+optionX);
          update_bubble(optionX, this.value, optionColor, bubbleChart, facts, data);
      	  dc.redrawAll();
    	  });

        d3.select('#selectColor')
         .on('change', function(){ 
          resetAll();
          var optionX = d3.select("#selectX").node().value;
          var optionY = d3.select("#selectY").node().value;
          update_title("pie", "By "+this.value);
          update_pieChart(this.value, pieChart, facts, data);
          update_bubble(optionX, optionY, this.value, bubbleChart, facts, data);
      	  dc.redrawAll(); 
    	  });

        d3.select('#selectBar')
         .on('change', function(){ 
      	  resetAll();
          update_title("bar", "By "+this.value);
          update_barChart(this.value, barChart, facts, data);
      	  dc.redrawAll(); 
    	  });

        d3.select('#selectHeatValue')
         .on('change', function(){ 
          resetAll();
          update_title("heatmap", this.value);
          update_heatmap("Post Hour", "Post Weekday", this.value, heatMap, heatLegend, facts, data);
          dc.redrawAll(); 
        });
      });

  });
}

plot("facebook");
 
