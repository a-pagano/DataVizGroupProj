var data = d3.range(500).map(function(d,i){
    return {index:i, value:Math.random()}
})

console.log(data)

d3.select('svg')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 2)
    .attr('cx', function(d,i){
        return mapx(d.index)
    })
    .attr('cy', function(d,i){
        return mapy(d.value)
    })

// Colored scatterplot
var data2 = d3.range(500).map(function(d,i){
    return {index:i, value:Math.random(),
    other:Math.random()}
})

var mapr = d3.scale.linear()
            .domain([0,1])
            .range([0,10])

var mapc = d3.scale.linear()
            .domain([0,1])
            .range(['red', 'green'])

var mapy = d3.scale.linear()
            .domain([0,1])
            .range([0,400])

var mapx = d3.scale.linear()
            .domain([0,500])
            .range([0,600])

d3.select('svg')
    .selectAll('circle')
    .data(data2)
    .enter()
    .append('circle')
    .attr('r', function(d,i){
        return mapr(d.other)
    })
    .attr('cx', function(d,i){
        return mapx(d.index)
    })
    .attr('cy', function(d,i){
        return mapy(d.value)
    })
    .style('fill', function(d,i){
        return mapc(d.value)
    })