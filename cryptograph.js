
(function() { 
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.
    
        var width=800, height=600
    
        //read in our csv file 
        d3.json("./coins.json").then((data) => {

          const svg = d3
          .select("#cryptograph")
          .append("g")
          .attr("transform", "translate(40,40)");

          data = data['bitcoin'].filter((d) => { //keep only items that have a date
              return d.date != "";
            })
            
          //filter out items without proce data
          data = data.filter((d) => {
              return d.price_usd != "";
          })

          var parseTime = d3.timeParse("%d/%m/%Y");
          function sortByDateAscending(a, b) {
            return a.date - b.date;
          } 
        
          data = data.sort(sortByDateAscending);
          console.log(data)

          const timeScale = d3
          .scaleTime()
          .domain(
            //earliest date, latest date
            d3.extent(data, (d) => {
              //console.log(parseTime(d.date));
              return parseTime(d.date);
            }) //[date1, date2]
          )
          .range([0, width]);
          console.log(timeScale)
          const yScale = d3
          .scaleLinear()
          .domain(
            d3.extent(data, (d) => {
              return +d.price_usd;
            })
          )
          .range([height, 0]);

          const lineGenerator = d3
          .line()
          .x(function (d, i) {
            return timeScale(parseTime(d.date)); //use our x scale on the index
          })
          .y(function (d) {
            return yScale(+d.price_usd); //use our y scale on the y value from data
          });
    
        //line generator will create SVG vectors based on data
          const line = lineGenerator(data);
    
        // Create a path element and set its d attribute
          svg
          .append("path")
          .attr("d", line) //data items
          .attr("stroke", "steelblue")
          .attr("stroke-width", "3px")
          .attr("fill", "white");

          // Add the x Axis
          svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(timeScale));
          // Add the y Axis
          svg.append("g")
          .call(d3.axisLeft(yScale));

        });
    
    })();
    