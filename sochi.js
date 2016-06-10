var data = d3.csv('athletes_sochi.csv', readData);

function readData(err, data)
{
    var clicks = 0;
    var gutter = 40
    var canvas_width = document.getElementById("canvas").attributes.width.nodeValue-(gutter*3)
    var canvas_height = document.getElementById("canvas").attributes.height.nodeValue-(gutter*2)
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
          //'figure skating': 'pink' , -- Weight not recorded for figure skaters, so data completely filtered-out
          'alpine skiing': 'limegreen',
          'nordic combined': 'cyan',
          'cross-country': 'orange',
          'curling': 'purple',
          'biathlon': 'magenta',
          'luge': 'lightgray',
          'ice hockey': 'darkred',
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
/*
        var byGender;
        //0==male
        if (g==0)  byGender = data.filter(function(d) { return (d.gender.toLowerCase()=="male")?true:false })
        else if (g==1) byGender = data.filter(function(d) { return (d.gender.toLowerCase()=="female")?true:false })
        else byGender = data //Everyone
*/
        for (var i=0; i<data.length; i++)
        {
            var d = data[i]
            d.filter = true
            if (g==0 && d.gender.toLowerCase()=='male') d.filter = false
            else if (g==1 && d.gender.toLowerCase()=='female') d.filter = false;
            else if (g==-1) d.filter = false
        }
        //console.log(byGender.length)
        
        //return byGender;
    }
    
    function trendlineByGender(g)
    {
        var xb = {}
        if (g==0) xb = { x:0.0039, b:1.4947 }; // male
        else if (g==1) xb = { x:0.0073, b:1.2182 } // female
        else if (g==-1) xb = { x:0.0055, b:1.3553 } // all
        return { x1:minWeight, x2:maxWeight, y1:minWeight*xb.x + xb.b, y2:maxWeight*xb.x + xb.b }
    }
    
    
    function sortByBMIstd(g)
    {
        var stdBMI = d3.nest()
                        .key(function(d, i){ return d.sport})
                        .rollup(function(d, i) { return calculateDevBMI(d)})
                        .entries(g)
        return stdBMI
        
    }
    
    function calculateDevBMI(g)
    {
        var BMI = []
        for (i=0; i<g.length; i++){
            BMI.push((g[i].weight)/(g[i].height)^2)
        }
        return d3.deviation(BMI)   
    }
    
    
    var trendline = trendlineByGender(-1)
    
    var title_text = 'Sochi Olympics: All Athletes'

    var plot = d3.select('svg')
    

    var title = plot.append('g')
      .attr('transform','translate('+((canvas_width/2)-((title_text.length*10)/2))+',30)')
      .append('text')
      .text(title_text)
      .attr("font-size", "30px") 
      .attr("fill","black")
      .attr('font-family','Courier New')
    
    var subtitle = plot.append('g')
      .attr('transform','translate('+((canvas_width/2)-((title_text.length*15)/2))+',50)')
      .append('text')
      .text("Do height and weight provide competitive advantage in different sports?")
      .attr("font-size", "15px") 
      .attr("fill","black")
      .attr('font-family','Courier New')

    var devBMI = sortByBMIstd(data)
    var sportArray = {}
    for (i=0; i<devBMI.length; i++){
        sportArray[devBMI[i].key] = devBMI[i].values
    }
    //console.log(sportArray)
    
    var plot_legend = plot.append('g')
      .attr('transform','translate('+(gutter)+',1)')
      .selectAll('g')
        
    var A =  Object.keys(sportArray).map(function (key) {return sportArray[key]});
    console.log(sportArray[sportArray==A.sort())
        
            
      .data(Object.keys(colors).sort(function(a, b){return sportArray[a.toUpperCase()]-sportArray[b.toUpperCase()]}))
      .enter()
      .append('g')
    plot_legend.append('rect')
      .attr('width','20')
      .attr('height','20')
      .attr('fill',function(d,i) { return colors[d] })
      .attr('x',gutter+10)
      .attr('y',function(d,i) { return (i*21) })
      .on('mouseenter', function(d, i) { highlightSports(d,true) })
      .on('mouseleave', function(d, i) { highlightSports(d,false) })

    plot_legend.append('text')
      .text(function(d,i) { return d })
      .attr('x',gutter+35)
      .attr('y',function(d,i) { return 15+(i*21) })
      .attr("font-size", "18px") 
      .attr("fill","black")
      .attr('font-family','Courier New')
   
    plot_legend.append('circle')
        .attr('r',size)
        .attr('stroke','black')
        .attr('stroke-width','3')
        .attr('fill','none')
        .attr('cx',gutter+20)
        .attr('cy',(15+(Object.keys(colors).length*21)))
    
    plot_legend.append('text')
      .text("Medal Winner")
      .attr('x',gutter+35)
      .attr('y',(20+(Object.keys(colors).length*21)))
      .attr("font-size", "18px") 
      .attr("fill","black")
      .attr('font-family','Courier New')

    var plot_trendline = plot.append('g')
      .attr('transform','translate('+((gutter*2)+size)+','+size+')')
      .append('line')
      .attr('x1',scaleWeight(trendline.x1))
      .attr('x2',scaleWeight(trendline.x2))
      .attr('y1',scaleHeight(trendline.y1))
      .attr('y2',scaleHeight(trendline.y2))
      .style('stroke','black')

    var plot_area = plot.append('g')
      .attr('transform','translate('+((gutter*2)+size)+','+size+')')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
      .attr('r',function(d,i) { return Number(d.total_medals)>0?medals_size:size })
      .attr('cy',function(d,i) { return scaleHeight(d.height) })
      .attr('cx',function(d,i) { return scaleWeight(d.weight) })
      .attr('fill',function(d,i) { return colors[String(d.sport).toLowerCase()]  })
      .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
      .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
      .on('mouseenter', function(d, i) { highlightSports(d.sport,true) })
      .on('mouseleave', function(d, i) { highlightSports(d.sport,false) })
        
            
    var axy = d3.svg.axis().scale(scaleHeight).orient('left')  
    var axx = d3.svg.axis().scale(scaleWeight).orient('bottom')  
    
    d3.select('svg')
      .append('g')
      .attr('transform','translate('+(gutter*2)+',20)')
      .call(axy)
      .append('g')
      .attr('transform','rotate(-90)')
      .append('text')
      .text('Height (m)')
      .attr('y',-gutter-15)
      .attr('x',-canvas_height/2)
      .style('stroke','black')


    d3.select('svg')
      .append('g')
      .attr('transform','translate('+(gutter*2)+','+(canvas_height+20)+')')
      .call(axx)
      .append('g')
      .append('text')
      .text('Weight (kg)')
      .attr('y',gutter)
      .attr('x',canvas_width/2)
      .style('stroke','black')

    
    function updateChart(g)
    {
      trendline = trendlineByGender(g)
      filterByGender(g)
      plot_area.transition()
          .duration(1000)
          .attr('r',function(d,i) 
                { 
                    if (d.filter) return 0;
                    else return Number(d.total_medals)>0?medals_size:size 
                })
          .attr('cy',function(d,i) { return scaleHeight(d.height) })
          .attr('cx',function(d,i) { return scaleWeight(d.weight) })
          .attr('fill',function(d,i) { return colors[String(d.sport).toLowerCase()]  })
          .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
          .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
          .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
      
      plot_trendline.transition()
        .duration(1000)
      .attr('x1',scaleWeight(trendline.x1))
      .attr('x2',scaleWeight(trendline.x2))
      .attr('y1',scaleHeight(trendline.y1))
      .attr('y2',scaleHeight(trendline.y2))
      
      
      var gender_str = 'All'
      if (g==0) gender_str = 'Male'
      else if (g==1) gender_str = 'Female'
      title_text = 'Sochi Olympics: '+gender_str+' Athletes'
      title.text(title_text)
      if (g != -1) button.text(g==0?"View by Females":"View by Males")
    }

    function highlightSports(s,highlight)
    {
        d3.select('svg')
          .selectAll('circle')
          .attr('opacity', function(d, i) 
            { 
                if (typeof d.sport=="undefined") return 1; // This is weird...select all circles gets the legend circle too...
                if (highlight) return s.toLowerCase()==d.sport.toLowerCase()?medals_opacity:0.05
                else return Number(d.total_medals)>0?medals_opacity:opacity        
            })
        d3.select('svg')
          .selectAll('rect')
          .style('stroke',function(d,i) { return highlight && s.toLowerCase()==d.toLowerCase()?'black':'none' })
          .style('stroke-width',function(d,i) { return highlight && s.toLowerCase()==d.toLowerCase()?'3':'0' })

    }
    
    
    var button = d3.select('body')
      .append('button')
      .text('View by Males')
      .on('click', function() {
        updateChart(clicks%2)
        clicks+=1;

      })
    d3.select('body')
      .append('button')
      .text('View by Everyone')
      .on('click', function() { updateChart(-1) })
      
        
}
