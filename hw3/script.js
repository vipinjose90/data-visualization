/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    let bar1children = document.getElementById("barChart1").children;
    let bar1Arr = [];
    let step = 1
    for(let child of bar1children){
        bar1Arr.push(parseInt(step)*13)
        step++
    }
    bar1Arr.sort(function compare(a,b) {
        if(a < b){
            return -1
        }
        else if(a > b){
            return 1
        }
        else{
            return 0
        }
        }
        
    )

    //console.log(bar1Arr.toString())
    let i=0
    for(let child of bar1children) {
        child.setAttribute('height',bar1Arr[i++])
    }
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {

    let transition_speed = 2000

    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    let aBars = d3.select("#barChart1")
        .selectAll("rect").data(data)

    aBars
        .exit()
        .transition()
        .duration(transition_speed)
        .style("opacity", 0)
        .remove();

    aBars
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("height",function (d) {
        return aScale(d.a);
    })

    aBars
        .enter().append("rect")
        .style("opacity", 0)
        .attr("x",function (d,i) {
            return parseInt(i+1)*10;
        })
        .attr("y",0)
        .attr("width",10)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("height",function (d) {
            return aScale(d.a);
        })


    // TODO: Select and update the 'b' bar chart bars
    let bBars = d3.select("#barChart2")
        .selectAll("rect").data(data)

    bBars
        .exit()
        .transition()
        .duration(transition_speed)
        .style("opacity", 0)
        .remove()

    bBars
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("height",function (d) {
        return bScale(d.b);
    })

    bBars.enter().append("rect")
        .attr("x",function (d,i) {
            return parseInt(i+1)*10;
        })
        .attr("y",0)
        .attr("width",10)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("height",function (d) {
            return bScale(d.b);
        })


    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    let line1 = d3.selectAll("#lines1").data(data)


    line1
        .style("opacity", 0.2)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("d", aLineGenerator(data))

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.b));

    d3.select("#lines2")
        .style("opacity", 0.2)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("d", bLineGenerator(data))

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    d3.selectAll("#area1")
        .style("opacity", 0.2)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("d", aAreaGenerator(data))


    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    d3.selectAll("#area2")
        .style("opacity", 0.2)
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("d", bAreaGenerator(data))


    // TODO: Select and update the scatterplot points

    let scatter = d3.select("#scatterplot")
        .selectAll("circle")
        .data(data)

    scatter.exit()
        .transition()
        .duration(transition_speed)
        .style("opacity", 0)
        .remove()

    scatter
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("cx",function (d) {
        return aScale(d.a);
    })
        .attr("cy",function (d) {
            return bScale(d.b);
        })

    scatter
        .on("click", function (d)  {
            console.log("x=",aScale(d.a),", y=",bScale(d.b))
        })
        .selectAll("title")
        .data(function(d) { return [d]; })
        .text(function(d) {
            return "x="+aScale(d.a) + " y=" + bScale(d.b);
        })
        .enter()
        .append("title")
        .text(function(d) {
            return "x="+aScale(d.a) + " y=" + bScale(d.b);
        })

    scatter.enter().append("circle")
        .transition()
        .duration(transition_speed)
        .style("opacity", 1)
        .attr("cx",function (d) {
            return aScale(d.a);
        })
        .attr("cy",function (d) {
            return bScale(d.b);
        })
        .attr("r",5)

    scatter
        .on("click", function (d)  {
            console.log("x=",aScale(d.a),", y=",bScale(d.b))
        })
        .selectAll("title")
        .data(function(d) { return [d]; })
        .text(function(d) {
            return "x="+aScale(d.a) + " y=" + bScale(d.b);
        })
        .enter()
        .append("title")
        .text(function(d) {
            return "x="+aScale(d.a) + " y=" + bScale(d.b);
        })


    // ****** TODO: PART IV ******
    d3.selectAll(".barChart>rect").on("mouseover", function ()  {
        let rect = event.target;
        rect.setAttribute("style", "fill:green");
    });
    d3.selectAll(".barChart>rect").on("mouseout", function ()  {
        let rect = event.target;
        rect.setAttribute("style","");
    });

}


/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}