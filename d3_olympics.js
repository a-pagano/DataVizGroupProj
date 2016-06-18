var data = d3.csv('athletes_sochi.csv', readData);

// array
var arr = {	
	max: function(array) {
		return Math.max.apply(null, array);
	},
	
	min: function(array) {
		return Math.min.apply(null, array);
	},
	
	range: function(array) {
		return arr.max(array) - arr.min(array);
	},
	
	midrange: function(array) {
		return arr.range(array) / 2;
	},

	sum: function(array) {
		var num = 0;
		for (var i = 0, l = array.length; i < l; i++) num += array[i];
		return num;
	},
	
	mean: function(array) {
		return arr.sum(array) / array.length;
	},
	
	median: function(array) {
		array.sort(function(a, b) {
			return a - b;
		});
		var mid = array.length / 2;
		return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
	},
	
	modes: function(array) {
		if (array.length === 0) return null;
		var modeMap = {},
			maxCount = 1,
			modes = [array[0]];
		
		array.forEach(function(val) {			
			if (modeMap[val] === undefined) modeMap[val] = 1;
			else modeMap[val]++;
			
			if (modeMap[val] > maxCount) {
				modes = [val];
				maxCount = modeMap[val];
			}
			else if (modeMap[val] == maxCount) {
				modes.push(val);
				maxCount = modeMap[val];
			}
		});
		return modes;
	},
	
	variance: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.pow(num - mean, 2);
		}));
	},
	
	standardDeviation: function(array) {
		return Math.sqrt(arr.variance(array));
	},
	
	meanAbsoluteDeviation: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.abs(num - mean);
		}));
	},
	
	zScores: function(array) {
		var mean = arr.mean(array);
		var standardDeviation = arr.standardDeviation(array);
		return array.map(function(num) {
			return (num - mean) / standardDeviation;
		});
}
};

//


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
    
    data.sort(function(a,b) { return a.total_medals - b.total_medals })

    var sports = 
        [
          { sport:'freestyle skiing', color:'#68FE44'} ,    //2 
          { sport:'snowboard', color:'#44FE90'} ,           //2
          { sport:'short track', color:'#ABB0F9'},          //1
          { sport:'alpine skiing', color:'#CA67BE'},        //3
          { sport:'nordic combined', color:'#ABECF9'},      //1
          { sport:'cross-country', color:'#A1FE44'},        //2
          { sport:'curling', color:'#BB67CA'},              //3
          { sport:'biathlon', color:'#ABD9F9'},             //1
          { sport:'luge', color:'#924088'},                 //3
          { sport:'ice hockey', color:'#EC7254'},           //4
          { sport:'bobsleigh', color:'#AB462D'},            //4
          { sport:'speed skating', color:'#44FE57'},        //2
          { sport:'skeleton', color:'#DC90FF'},             //3
          { sport:'ski jumping', color:'#ABF9F5'}           //1
        ]


    function getSport(s) 
    {
      for (var i=0; i<sports.length; i++) if(sports[i].sport==s.toLowerCase()) return sports[i]; 
    }

    function getStats(s)
    {
        var sport = getSport(s);
        mbis = []
        mbis_m = []
        mbis_f = []
        
        for (var i=0; i<data.length; i++)
        {
            if (data[i].sport.toLowerCase() != s) continue;
            mbis[mbis.length] = data[i].weight / Math.pow(data[i].height,2)
            if (data[i].gender.toLowerCase()=="male") mbis_m[mbis_m.length] = mbis[mbis.length]
            else if (data[i].gender.toLowerCase()=="female") mbis_f[mbis_f.length] = mbis[mbis.length]
        }
        sport.avg_bmi = arr.mean(mbis)
        sport.sd_bmi = arr.standardDeviation(mbis)
        sport.avg_bmi_m = arr.mean(mbis_m)
        sport.sd_bmi_m = arr.standardDeviation(mbis_m)
        sport.avg_bmi_f = arr.mean(mbis_f)
        sport.sd_bmi_f = arr.standardDeviation(mbis_f)
    }
    
    for (var i=0; i<sports.length; i++) { getStats(sports[i].sport); }

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
        if (g==0) sports.sort(function(a,b) { return a.avg_bmi_m - b.avg_bmi_m })
        else if (g==1) sports.sort(function(a,b) { return a.avg_bmi_f - b.avg_bmi_f })
        else sports.sort(function(a,b) { return a.avg_bmi - b.avg_bmi })

        for (var i=0; i<data.length; i++)
        {
            var d = data[i]
            d.filter = true
            if (g==0 && d.gender.toLowerCase()=='male') d.filter = false
            else if (g==1 && d.gender.toLowerCase()=='female') d.filter = false;
            else if (g==-1) d.filter = false
        }
    }
    
    function filterBySport(s)
    {
        console.log("filtering for "+s)
        var ret = data.filter(function (d) { return d.sport.toLowerCase() == s.toLowerCase() })
        console.log("Returning filtered data length "+ret.length)
        return ret
    }
    
    XYvalues = xy_values(data)
    var lr = linearRegression(XYvalues[1], XYvalues[0])
    
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

    var plot_legend = plot.append('g')
      .attr('transform','translate('+(gutter)+',1)')
      .selectAll('g')
      .data(sports)
      .enter()
      .append('g')
    
    filterByGender(-1)
    var plot_legend_rect = plot_legend.append('rect')
      .attr('width','20')
      .attr('height','20')
      .data(sports)
      .attr('fill',function(d,i) { return d.color })
      .attr('x',gutter+10)
      .attr('y',function(d,i) { return (i*21) })
      .on('mouseenter', function(d, i) { highlightSports(d.sport,true, data) })
      .on('mouseleave', function(d, i) { highlightSports(d.sport,false, data) })

    var plot_legend_text = plot_legend.append('text')
      .data(sports)
      .text(function(d,i) { return d.sport })
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
        .attr('cy',(15+(sports.length*21)))
    
    plot_legend.append('text')
      .text("Medal Winner")
      .attr('x',gutter+35)
      .attr('y',(20+(sports.length*21)))
      .attr("font-size", "18px") 
      .attr("fill","black")
      .attr('font-family','Courier New')

    var plot_trendline = plot.append('g')
      .attr('transform','translate('+((gutter*2)+size)+','+size+')')
      .append('line')
      .attr('x1',scaleWeight(lr.x1))
      .attr('x2',scaleWeight(lr.x2))
      .attr('y1',scaleHeight(lr.y1))
      .attr('y2',scaleHeight(lr.y2))
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
      .attr('fill',function(d,i) { return getSport(d.sport).color })
      .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
      .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
      .on('mouseenter', function(d, i) { highlightSports(d.sport,true, data) })
      .on('mouseleave', function(d, i) { highlightSports(d.sport,false, data) })
        
            
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
      filterByGender(g)
      XYvalues = xy_values(data)
      var lr = linearRegression(XYvalues[1], XYvalues[0])
      
      plot_area.transition()
          .duration(1000)
          .attr('r',function(d,i) 
                { 
                    if (d.filter) return 0;
                    else return Number(d.total_medals)>0?medals_size:size 
                })
          .attr('cy',function(d,i) { return scaleHeight(d.height) })
          .attr('cx',function(d,i) { return scaleWeight(d.weight) })
          .attr('fill',function(d,i) { return getSport(d.sport).color  })
          .style('stroke',function(d,i) { return Number(d.total_medals)>0?'black':'none' })
          .style('stroke-width',function(d,i) { return Number(d.total_medals)>0?'3':'0' })
          .attr('opacity',function(d,i) { return Number(d.total_medals)>0?medals_opacity:opacity })
      
      plot_trendline.transition()
        .duration(1000)
        .attr('x1',scaleWeight(lr.x1))
        .attr('x2',scaleWeight(lr.x2))
        .attr('y1',scaleHeight(lr.y1))
        .attr('y2',scaleHeight(lr.y2))
     
   plot_legend_rect.data(sports).transition()
      .duration(1000)
      .attr('fill',function(d,i) { return d.color })

    plot_legend_text.data(sports).transition()
      .duration(1000)
      .text(function(d,i) { return d.sport })

      
      var gender_str = 'All'
      if (g==0) gender_str = 'Male'
      else if (g==1) gender_str = 'Female'
      title_text = 'Sochi Olympics: '+gender_str+' Athletes'
      title.text(title_text)
      if (g != -1) button.text(g==0?"View by Females":"View by Males")
    }

    function highlightSports(s,highlight, datax)
    {
        d3.select('svg')
          .selectAll('circle')
          .attr('opacity', function(d, i) 
            { 
                if (typeof d.sport=="undefined") return 1; // This is weird...select all circles gets the legend circle too...
                if (highlight) return s.toLowerCase()==d.sport.toLowerCase()?medals_opacity:0.05
                else return Number(d.total_medals)>0?medals_opacity:opacity        
            })
          .attr('fill', function(d, i) 
            { 
                if (typeof d.sport=="undefined") return 'none'; // This is weird...select all circles gets the legend circle too...
                if (highlight) return s.toLowerCase()==d.sport.toLowerCase()?getSport(d.sport).color:'gray'
                else return getSport(d.sport).color
            })
        

        d3.select('svg')
          .selectAll('rect')
          .style('stroke',function(d,i) { return highlight && s.toLowerCase()==d.sport.toLowerCase()?'black':'none' })
          .style('stroke-width',function(d,i) { return highlight && s.toLowerCase()==d.sport.toLowerCase()?'3':'0' })
        
        var dataFiltered = filterBySport(s)
        
        if(highlight){
            XYvalues = xy_values(dataFiltered)
            var lr = linearRegression(XYvalues[1], XYvalues[0])
            console.log(XYvalues[1])
            plot_trendline.transition()
              .duration(0)
              .attr('x1',scaleWeight(lr.x1))
              .attr('x2',scaleWeight(lr.x2))
              .attr('y1',scaleHeight(lr.y1))
              .attr('y2',scaleHeight(lr.y2))
        }
        else{
            XYvalues = xy_values(data)
            var lr = linearRegression(XYvalues[1], XYvalues[0])
            plot_trendline.transition()
              .duration(0)
              .attr('x1',scaleWeight(lr.x1))
              .attr('x2',scaleWeight(lr.x2))
              .attr('y1',scaleHeight(lr.y1))
              .attr('y2',scaleHeight(lr.y2))
        }
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
    
    //-------------------------------------
      function linearRegression(y,x){

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x); 
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
          
        return { x1:minWeight, x2:maxWeight, y1:minWeight*lr['slope'] + lr['intercept'], y2:maxWeight*lr['slope'] +                         lr['intercept'] };
        };

    
        function xy_values(data){
                var yval = []
                var xval = []

                for(i=0; i<data.length; i++){
                    if (typeof data[i].filter != "undefined" && data[i].filter == true) continue;
                    yval[yval.length] = Number(data[i].height)
                    xval[xval.length] = Number(data[i].weight)

                }
                return [xval, yval];
            };
}

    
