function getMaxW(data) {return d3.max(data, function(d, i){return Number(d.weight)})}
function getMinW(data) {return d3.min(data, function(d, i){return Number(d.weight)})}
function getMaxH(data) {return d3.max(data, function(d, i){return Number(d.height)})}
function getMinH(data) {return d3.min(data, function(d, i){return Number(d.height)})}

d3.csv('/../exercises/Visualization/datasets/athletes_sochi.csv', function(err, data) {
    
    // filter data
//    data = data.filter(function(d){
//        if(Number(d.weight) > 0 && Number(d.height) > 0) {
//            return true;
//        } else {
//            return false;
//        }
//    })
    data = data.filter(function(d){
        if (Number(d.weight) > 0 && Number(d.height) > 0 && String(d.sport).length > 0 && String(d.gender).length > 0) return true;
        else return false;
    })
    console.log(data)
    
    
    var mapr = d3.scale.linear()
            .domain([getMinW(data), getMaxW(data)])
            .range([5, 495])
    var maph = d3.scale.linear()
            .domain([getMinH(data), getMaxH(data)])
            .range([495, 5])
    d3.select('svg')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 2)
        .attr('cx', function(d, i) {return mapr(d.weight)})
        .attr('cy', function(d, i) {return maph(d.height)})
        .style('fill', 'black')
        
})