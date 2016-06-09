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
console.log(colors)
    var title_text = 'Sochi Olympics: Female Athletes'
    var genderData = filterByGender(1)
    var plot = d3.select('svg')
    var title = plot.append('g')
      .attr('transform','translate('+((canvas_width/2)-((title_text.length*20)/2))+',30)')
      .append('text')
      .text(title_text)
      .attr("font-size", "30px") 
      .attr("fill","black")
      .attr('font-family','Courier New')
    
    var plot_legend = plot.append('g')
      .attr('transform','translate(-40,10)')
      .selectAll('g')
      .data(Object.keys(colors).sort())
      .enter()
      .append('g')
    plot_legend.append('rect')
      .attr('width','20')
      .attr('height','20')
      .attr('fill',function(d,i) { return colors[d] })
      .attr('x',50)
      .attr('y',function(d,i) { return (i*21) })
    plot_legend.append('text')
      .text(function(d,i) { return d })
      .attr('x',75)
      .attr('y',function(d,i) { return 15+(i*21) })
      .attr("font-size", "18px") 
      .attr("fill","black")
      .attr('font-family','Courier New')
    
    var plot_area = plot.append('g')
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

        .on('mouseenter', function(d, i) {
            highlightSports(d.sport)
        })
        .on('mouseleave', function(d, i) {
            d3.select('svg')
            .selectAll('circle')
            .data(genderData)
            .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
        })
        
    
      

    

    function updateChart(g)
    {
      genderData = filterByGender(g)
      
      plot_area.data(genderData)
          .transition()
          .duration(1000)
          .attr('r',function(d,i) { return Number(d.total_medals)>0?medals_size:size })
          .attr('cy',function(d,i) { return scaleHeight(d.height) })
          .attr('cx',function(d,i) { return scaleWeight(d.weight) })
          .attr('fill',function(d,i) { return colors[String(d.sport).toLowerCase()]  })
          .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
          .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })

          .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
      
      title_text = g==0?'Sochi Olympics: Male Athletes':'Sochi Olympics: Female Athletes'
      title.text(title_text)


      button.text(g==0?"Males":"Females")
    }
    
    function highlightSports(s)
    {
        
        d3.select('svg')
            .selectAll('circle')
            .data(genderData)
            .attr('opacity', function(d, i){if(s==d.sport) {return medals_opacity} else{return 0.1}})
//            .attr('opacity', function(d, i){if(s==d.sport) {return medals_opacity} else{return opacity}})
            
        
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
