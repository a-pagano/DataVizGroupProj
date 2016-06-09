var data = d3.csv('athletes_sochi.csv', readData);

function readData(err, data)
{
    var clicks = 0;
    var gutter = 50
    var canvas_width = document.getElementById("canvas").attributes.width.nodeValue
    var canvas_height = document.getElementById("canvas").attributes.height.nodeValue-gutter
    var size = 8
    var medals_size = 10
    var opacity = .25
    var medals_opacity = .9
    
    data = data.filter(function(d){
        if (Number(d.weight) > 0 && Number(d.height) > 0 && String(d.sport).length > 0 && String(d.gender).length > 0) return true;
        else return false;
    })

    var colors = 
      {
          'freestyle skiing':'green' ,
          'snowboard': 'gray' ,
          'short track': 'darkblue',
          'figure skating': 'pink' ,
          'alpine skiing': 'limegreen',
          'nordic combined': 'cyan',
          'cross-country': 'orange',
          'curling': 'purple',
          'biathlon': 'magenta',
          'luge': 'lightgray',
          'ice hockey': 'black',
          'bobsleigh': 'red',
          'speed skating': 'gold',
          'skeleton': 'darkgoldenrod',
          'ski jumping': 'cadetblue'
      }

    var maxWeight = d3.max(data,function(d,i) { return Number(d.weight); });
    var minWeight = d3.min(data,function(d,i) { return Number(d.weight); });
    var maxHeight = d3.max(data,function(d,i) { return Number(d.height); });
    var minHeight = d3.min(data,function(d,i) { return Number(d.height); });

    var scaleWeight = d3.scale.linear()
                       .domain([ minWeight, maxWeight ])
                       .range([ 0 , canvas_width ])

    var scaleHeight = d3.scale.linear()
                       .domain([ minHeight, maxHeight ])
                       .range([ canvas_height , 0  ])
    
    function filterByGender(g)
    {
        var byGender;
        //0==male
        if (g==0)  byGender = data.filter(function(d) { return (d.gender.toLowerCase()=="male")?true:false })
        else  byGender = data.filter(function(d) { return (d.gender.toLowerCase()=="female")?true:false })
        return byGender;
    }

    var genderData = filterByGender(1)
    var plot = d3.select('svg')
      .append('g')
      .attr('transform','translate('+(50+size)+','+size+')')
      .selectAll('circle')
      .data(genderData)
      .enter()
      .append('circle')
      .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
      .attr('r',function(d,i) { return Number(d.total_medals)>0?medals_size:size })
      .attr('cy',function(d,i) { return scaleHeight(d.height) })
      .attr('cx',function(d,i) { return scaleWeight(d.weight) })
      .attr('fill',function(d,i) { return colors[String(d.sport).toLowerCase()]  })
      .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
      .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
      
    function updateChart(g)
    {
      genderData = filterByGender(g)
      
      plot.data(genderData)
          .transition()
          .duration(1000)
          .attr('r',function(d,i) { return Number(d.total_medals)>0?medals_size:size })
          .attr('cy',function(d,i) { return scaleHeight(d.height) })
          .attr('cx',function(d,i) { return scaleWeight(d.weight) })
          .attr('fill',function(d,i) { return colors[String(d.sport).toLowerCase()]  })
          .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
          .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
          .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })


      button.text(g==0?"Males":"Females")
    }
    
var button = d3.select('body')
  .append('button')
  .text('Females')
  .on('click', function() {
    console.log('click')
    clicks+=1;
    updateChart(clicks%2==0)
})
}
