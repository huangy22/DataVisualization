
var colorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];
var barChart = dc.barChart("#bar-chart");
var pieChart = dc.pieChart("#pie-chart");
var bubbleChart = dc.bubbleChart("#bubble-chart");
var heatMap = dc.heatMap("#heatmap");
var heatLegend = dc.heatMap("#heat-legend");
var lineChart = dc.lineChart("#line-chart");

charts_name = {};
charts_name["facebook"] = ["bubble", "pie", "bar", "heatmap", "line"];
charts_name["wine"] = ["bubble", "pie", "bar"];

captions = {};
captions["facebook"] = [];

// bubble chart caption
var h = document.createElement('text');
var para = document.createElement('P');
var bold = document.createElement('B');
var t = document.createTextNode("Color Legend: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The bubble chart shares the same color legend with the pie chart to the right.");
para.appendChild(t);
h.appendChild(para);

para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The Lifetime Total Reach and Lifetime total Impression of the\
  facebook posts have an approximately linear correlation with some outliers. The posts\
  with high Total Reach and Total Impressions are all photos and videos.\
  Status and links have less reach and impressions.");
para.appendChild(t);
h.appendChild(para);
captions["facebook"].push(h);

// pie chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The pie chart shows the count and percentage of different types, categories, \
  post weekday, paid/unpaid among all the posts. Most of the posts are photos.");
para.appendChild(t);
h.appendChild(para);
captions["facebook"].push(h);

// bar chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("Histogram of different categories, types, post weekday, hour, month, \
  paid/unpaid of all the posts. Select one category, and we can find in the pie chart: 97% of the \
  'Inspiration' category are photos, while in 'product' \
  category, there are 29% status and 70% photos.");
para.appendChild(t);
h.appendChild(para);
captions["facebook"].push(h);

// heatmap caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The heatmap shows the distribution at different post hour and weekday.\
  The color can represent different measures for the popularity of the posts. The most popular posts\
  are posted in the morning and around noon.");
para.appendChild(t);
h.appendChild(para);
captions["facebook"].push(h);

// line chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The line chart shows how the measure of popularity depends on post Month\
  and post hour.");
para.appendChild(t);
h.appendChild(para);
captions["facebook"].push(h);

captions["wine"] = [];

// bubble chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Color Legend: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The bubble chart shares the same color legend with the pie chart to the right.");
para.appendChild(t);
h.appendChild(para);

para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The white and red wines clearly form in to two clusters. White wines have\
  lower volatile acidity, and higher citric acid. Select different properties to see how they differ for\
  white and red wines.");
para.appendChild(t);
h.appendChild(para);
captions["wine"].push(h);

// pie chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("There are 75% white wine and 25% red wines in the data set. You can also\
  use quality as the color attribute and see the scatter plot for wines of different qualities. There are\
  no clear clusters and different properties vary case by case.");
para.appendChild(t);
h.appendChild(para);
captions["wine"].push(h);

// bar chart caption
h = document.createElement('text');
para = document.createElement('P');
bold = document.createElement('B');
t = document.createTextNode("Description: ");
bold.appendChild(t);
para.appendChild(bold);
t = document.createTextNode("The histogram for wines with different qualities. You can select one quality level\
  to see different properties like volatile acidity and citric acid from the scatter plot. If we only look at the\
  good wines (quality 7 and above), the volatile acidity and citric acid of white wines are located in a compact cluster. \
  While the citric acid of good red wines seem to form into two clusters.");
para.appendChild(t);
h.appendChild(para);
captions["wine"].push(h);

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

function remove_captions(dataset){
  for(var i=0; i<charts_name[dataset].length; i++){
    fig = charts_name[dataset][i];
    var myNode = document.getElementById("caption-"+fig);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }
}

function add_captions(dataset){
  for(var i=0; i<charts_name[dataset].length; i++){
    fig = charts_name[dataset][i];
    var myNode = document.getElementById("caption-"+fig);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    console.log(fig, captions[dataset][i]);
    myNode.appendChild(captions[dataset][i]); 
  }
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
               "Weekday : " + d.key[1].split(".")[1] + "\n" +
               value_axis+" (Average) : " + Math.round(d.value.average*100)/100;})
    .colorDomain([minValue, maxValue])
    .rowsLabel(function (v) {
      return v.split(".")[1];
      })
    .on("pretransition", function(chart){
        chart.select("svg").selectAll(".label")
        .data([1])
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", "+20")
        .attr("y", "+10")
        .attr("dy", "+190")
        .attr("dx", "+220")
        .text("Post Hour");
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
        .height(60)
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
          return "";
        })
        .colors(["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
        .calculateColorDomain()
        .renderTitle(true)
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
  barChart.width(400)
    .height(200)
    .margins({top: 10, right: 10, bottom: 50, left: 50})
    .dimension(barValue)                // the values across the x axis
    .group(barCount)              // the values on the y axis
    .transitionDuration(500)
    .xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal())
    .elasticY(true)
    .xAxisLabel(bar_axis)
    .yAxisLabel("Count")
    .ordering(function(d) { return +d.key; })
    .renderTitle(true)
    .title(function(d) {
      if(bar_axis=="Post Weekday")
        title = bar_axis+": " + d.key.split(".")[1]+"\n";
      else
        title = bar_axis+": " + d.key+"\n";
      title += "Count: "+ d.value;
      return title;
    });

  barChart.xAxis().tickFormat(function(d){
    if(bar_axis=="Post Weekday")
      tick = d.split(".")[1];
    else
      tick = d;
    return tick;
  });
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

  totalcount = d3.sum(data, function(d){return 1;});

  var pieCount = pieValue.group().reduceCount(function(d){return d[color_axis];});


  var color_map = data.map(function(d){return d[color_axis];});

  pieChart 
    .width(400)
    .height(200)
    .radius(80)
    .innerRadius(30)
    .dimension(pieValue)
    .group(pieCount)
    .transitionDuration(500)
    .colors(d3.scale.category10().domain(color_map))
    .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))
    .renderTitle(true)
    .title(function(d){
      return color_axis+": "+d.key+"\n"
      +"Count : "+d.value+"\n"
      +"Percentage :" + Math.round(d.value/d3.sum(pieCount.all(),function(d){return d.value; })*100)+'%';});
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

  //line chart
  lineChart.width(500)
    .height(300)
    .margins({top: 10, right: 10, bottom: 50, left: 60})
    .brushOn(true)
    .dimension(lineValue)
    .group(lineGroup)
    .transitionDuration(500)
    .keyAccessor(function (p) {
      return p.key;
        })
    .valueAccessor(function (p) {
      return p.value.yColumn;
        })
    .x(d3.scale.linear().domain([d3.min(data, function(d){return +d[xColumn];}), d3.max(data, function(d){return +d[xColumn];})]))
    .xAxisLabel(xColumn)
    .yAxisLabel(yColumn)
    .elasticY(true)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true);
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
          p.xColumn = -20000;
          p.yColumn = -20000;
        }
        return p;
      },
      function (p, d){
        return {count:0, xSum:0, ySum:0, xColumn:0, yColumn:0, color:""};
      }
     );

  var color_map = data.map(function(d){return d[color_axis];});

    // bubble chart
  bubbleChart.width(600)
  	.height(400)
  	.margins({top: 10, right: 15, bottom: 50, left: 60})
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
  	.x(d3.scale.linear().domain([0, d3.max(data, function(d){return d[xColumn];})]))
  	.y(d3.scale.linear().domain([0, d3.max(data, function(d){return d[yColumn];})]))
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

  if(dataset==="facebook"){
    remove_captions("wine");
    add_captions("facebook");

    if(!dc.hasChart(heatMap)){
      dc.registerChart(heatMap);
      dc.registerChart(heatLegend);
    }
    if(!dc.hasChart(lineChart))
      dc.registerChart(lineChart);

  }else{
    remove_captions("facebook");
    add_captions("wine");

    dc.deregisterChart(heatMap);
    dc.deregisterChart(heatLegend);
    dc.deregisterChart(lineChart);
  }


  d3.json("./clean_data/metadata_"+dataset+".json", function(error, data) {
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
          if(i==1)
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
          if(i==2)
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
          if(i==1)
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
          if(i==1)
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
          if(i==1)
            el.selected = true;
          selectYLine.appendChild(el);
      }


      // load data from a csv file
      d3.csv("./clean_data/data_"+dataset+".csv", function (data) {

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
        update_barChart(bar_axis[1], barChart, facts, data);

        if(dataset=="facebook"){
          // for heatmap
          update_title("heatmap", scatter_axis[1]);
          update_heatmap("Post Hour", "Post Weekday", scatter_axis[1], heatMap, heatLegend, facts, data);
        }else{
          remove_title("heatmap");
        }

        if(dataset=="facebook"){
          // for line chart
          update_title("line", scatter_axis[1]+ " By "+ "Post Month");
          update_lineChart("Post Month", scatter_axis[1], lineChart, facts, data);
          update_lineChart("Post Month", scatter_axis[1], lineChart, facts, data);
        }else{
          remove_title("line");
        }

        // for pie plot
        update_title("pie", "By "+color_axis[0]);
        update_pieChart(color_axis[0], pieChart, facts, data);
        
        //bubble chart
        update_title("bubble", scatter_axis[2]+ " By "+scatter_axis[1]);
        update_bubble(scatter_axis[1], scatter_axis[2], color_axis[0], bubbleChart, facts, data);
        update_bubble(scatter_axis[1], scatter_axis[2], color_axis[0], bubbleChart, facts, data);

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
 
