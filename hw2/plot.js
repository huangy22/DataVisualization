
/**********************************
* Step0: Load data from json file *
**********************************/
function update_barChart(bar_axis, barChart, facts, data){

  var barValue = facts.dimension(function (d) {
    return d[bar_axis];       // group or filter by magnitude
  });
  var barCount = barValue.group()
    .reduceCount(function(d) { return d[bar_axis]; });
  
  var map = data.map(function (d) {return d[bar_axis]; });
  var range = d3.range(d3.min(map), d3.max(map));

  // Bar Graph
  barChart.width(400)
    .height(300)
    .margins({top: 10, right: 10, bottom: 40, left: 40})
    .dimension(barValue)                // the values across the x axis
    .group(barCount)              // the values on the y axis
    .brushOn(true)
    .transitionDuration(500)
    .centerBar(true)
    .x(d3.scale.linear().domain([d3.min(map)-0.5, d3.max(map)+0.5]))
    .outerPadding(0.2)
    .elasticY(true)
    .xAxisLabel(bar_axis)
    .yAxisLabel("Count")
    .xAxis().tickFormat(function(v) {return v;});

}

function remove_empty_groups(source_group) {
    console.log(source_group);
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                // return d.value.count != 0;
                return true;
            });
        }
    };
}


// function reset_data(ndx, dimension, chart){
//     console.log(chart);
//     var filters = chart.filters;
//     chart.filter(null);
//     ndx.remove();
//     chart.filter([filters]);
// }

function update_bubble(xColumn, yColumn, bubbleChart, facts, data, bar_axis){

  var colorList = ["#ff7f0e", "#1f77b4", "#2ca02c", "#d62728", "#9467bd"];
  var bubbleValue = facts.dimension(function (d){
    return [d[xColumn], d[yColumn]];
  });

  var bubbleGroup = bubbleValue.group();
  console.log(bubbleGroup);
  // bubbleGroup = remove_empty_groups(bubbleGroup);
  console.log(bubbleGroup);
  bubbleGroup = bubbleGroup
    .reduce(
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
        p.color -= d[bar_axis[0]];
        p.size -= d[bar_axis[1]];
        return p;
      },
      function (p, d){
        return {count:0, xSum:0, ySum:0, xColumn:0, yColumn:0, color:"", size:0};
      }
     );


  var minX=bubbleValue.bottom(1)[0][xColumn];
  var maxX=bubbleValue.top(1)[0][xColumn];
  var minY=bubbleValue.bottom(1)[0][yColumn];
  var maxY=bubbleValue.top(1)[0][yColumn];
  var minSize = d3.min(data, function(d){return d[bar_axis[1]];});
  var maxSize = d3.max(data, function(d){return d[bar_axis[1]];});

    // bubble chart
  bubbleChart.width(600)
    .height(400)
    .margins({top: 10, right: 10, bottom: 50, left: 80})
    .dimension(bubbleValue)
    .group(bubbleGroup)
    .transitionDuration(500)
    .colors(d3.scale.ordinal().range(colorList))
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
            return p.value.size;
        })
    .maxBubbleRelativeSize(0.008)
    .x(d3.scale.linear().domain([minX, maxX+1]))
    .y(d3.scale.linear().domain([minY, maxY+1]))
    .r(d3.scale.linear().domain([minSize, maxSize]))
    .elasticY(true)
    .elasticX(true)
    .xAxisPadding((maxX-minX)*0.5)
    .yAxisPadding((maxY-minY)*0.5)
    .yAxisLabel(yColumn)
    .xAxisLabel(xColumn)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
    .on("renderlet.bubbleprobe", function(chart) {
      chart.selectAll('node')
          .on('mouseover.bubble', function(d) {
              chart.select('.display-qux').text(bar_axis[0]+': ' + d.value.color + '\n'+bar_axis[1]+': ' +d.value.size);
          })
          .on('mouseout.bubble', function(d) {
              chart.select('.display-qux').text('');
          });
    });
}


d3.json("metadata_facebook.json", function(error, data) {
    console.log(data); // this is your data
    n_scatter = data["number of numerical data"];
    n_bar = data["number of category data"];
    scatter_axis = data["numerical"];
    bar_axis = data["category"];
    console.log(bar_axis[0]);

    var selectX = document.getElementById("selectX");
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
    var optionsBar = bar_axis;
    for(var i = 0; i < optionsY.length; i++) {
        var opt = optionsBar[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        if(i==0)
          el.selected = true;
        selectBar.appendChild(el);

    }
    // load data from a csv file
    d3.csv("data_facebook.csv", function (data) {

      data.forEach(function(d){
        var keys = d3.keys(d);
        for(var i = 0, n = keys.length; i<n; i++){
        	d[keys[i]] = +d[keys[i]];
        }
        return d;
      });

    /******************************************************
    * Step1: Create the dc.js chart objects & ling to div *
    ******************************************************/

      var barChart = dc.barChart("#bar-chart");
      var bubbleChart = dc.bubbleChart("#bubble-chart");
      
    /****************************************
    *   Run the data through crossfilter    *
    ****************************************/

      var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

    /******************************************************
    * Create the Dimensions                               *
    * A dimension is something to group or filter by.     *
    * Crossfilter can filter by exact value, or by range. *
    ******************************************************/

      // for bar plot
      update_barChart(bar_axis[0], barChart, facts, data);

      
      //bubble chart
      update_bubble(scatter_axis[0], scatter_axis[1], bubbleChart, facts, data, bar_axis);


      
    /****************************
    * Step6: Render the Charts  *
    ****************************/
          
      dc.renderAll();

      d3.select('#selectX')
       .on('change', function(){ 
        // var e =document.getElementById('#selectY');
        var e = d3.select("#selectY").node(); 
        var optionY = e.value;
        update_bubble(this.value, optionY, bubbleChart, facts, data, bar_axis);
        dc.redrawAll(); });

      d3.select('#selectY')
       .on('change', function(){ 
        var e = d3.select("#selectX").node(); 
        var optionX = e.value;
        update_bubble(optionX, this.value, bubbleChart, facts, data, bar_axis);
        dc.redrawAll(); });

      d3.select('#selectBar')
       .on('change', function(){ 
        update_barChart(this.value, barChart, facts, data);
        dc.redrawAll(); });

      // d3.select('#resetBar')
      //   .on('click', function(){
      //     var optionBar = d3.select("#selectBar").node().value; 
      //     var barValue = facts.dimension(function (d){
      //       return d[optionBar];
      //     });
      //     update_barChart(optionBar, barChart, facts, data);
      //     dc.renderAll(); });

      // d3.select('#resetBubble')
      //   .on('click', function(){
      //     var X = d3.select("#selectX").node().value; 
      //     var Y = d3.select("#selectY").node().value; 
      //     var bubbleValue = facts.dimension(function (d){
      //       return [d[X], d[Y]];
      //     });
      //     update_bubble(X, Y, bubbleChart, facts, data, bar_axis);
      //     dc.renderAll(); });
       
    });
});
 

 
