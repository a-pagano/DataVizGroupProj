var data = d3.csv('athletes_sochi.csv', readData);

function readData(err, data)
{
    var gutter = 50
    var canvas_width = document.getElementById("canvas").attributes.width.nodeValue
    var canvas_height = document.getElementById("canvas").attributes.height.nodeValue-gutter
    var size = 12
    data = data.filter(function(d){
        if (Number(d.age) > 0 && Number(d.height) > 0) return true;
        else return false;
    })

    var maxAge = d3.max(data,function(d,i) { return Number(d.age); });
    var minAge = d3.min(data,function(d,i) { return Number(d.age); });
    var maxHeight = d3.max(data,function(d,i) { return Number(d.height); });
    var minHeight = d3.min(data,function(d,i) { return Number(d.height); });
    console.log(maxAge+" "+minAge+" "+maxHeight+" "+minHeight)
    var scaleWidth = d3.scale.linear()
                       .domain([ minAge, maxAge ])
                       .range([ 0, canvas_width ])

    var scaleHeight = d3.scale.linear()
                       .domain([ minHeight, maxHeight ])
                       .range([  canvas_height ,0  ])
    
    var axx = d3.svg.axis()
                .scale(scaleWidth)
                .orient('bottom')
    
    var axy = d3.svg.axis()
                .scale(scaleHeight)
                .orient('left')
    
    d3.select('svg')
      .append('g')
      .attr('transform','translate('+(gutter+(size))+','+(canvas_height+size)+')')
      .call(axx)
    
    d3.select('svg')
      .append('g')
      .call(axy)
      .attr('transform','translate(50,'+size+')')

    d3.select('svg')
      .append('g')
      .attr('transform','translate('+(50+size)+','+size+')')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('opacity',.08)
      .attr('r',size)
      .attr('cy',function(d,i) { return scaleHeight(d.height) })
      .attr('cx',function(d,i) { return scaleWidth(d.age) })
      .attr('fill',function(d,i) {
                        if (d.gender=="Male") return "blue";
                        else return "pink"
                   })
}

/*
    data.sort(function(a,b) 
                           { 
                                var age = Number(a.age) - Number(b.age)
                                var height = Number(a.height) - Number(b.height)
                                
                                if (age==0) return height;
                                else return age;
                           }) 
*/
