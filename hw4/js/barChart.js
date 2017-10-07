/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        let transition_speed = 1500;
        let x_offset = 60;
        let y_offset = 40;
        let padding = 5;

        let barcont_height = d3.select("#barChart").attr("height");
        let barcont_width = d3.select("#barChart").attr("width");

        // ******* TODO: PART I *******

        let bar_width = (barcont_width  - ( 1.5 * x_offset)) / this.allData.length;

        // Create the x and y scales; make
        // sure to leave room for the axes
        let yScale = d3
            .scaleLinear()
            .domain([0,d3.max(this.allData.map(function (d) {
                return d[selectedDimension];
                }))
            ])
            .range([(barcont_height-y_offset),0]);

        let years = this.allData.map(d=>d['year'])
        let xOrdinal = d3.scaleBand()
            .domain(years)
            .range([barcont_width-x_offset,0]);

        let xScale = d3
            .scaleLinear()
            .domain([0,this.allData.length])
            .range([barcont_width-x_offset,0]);

        // Create colorScale
        let colorScale = d3.scaleLinear()
            .domain([d3.min(this.allData.map(function (d) {
                return d[selectedDimension]
            })), d3.max(this.allData.map(function (d) {
                return d[selectedDimension]
            }))
            ])
            .range(["#0d63a6","#032f51"]);

        // Create the axes (hint: use #xAxis and #yAxis)
        let xAxis = d3.axisBottom();
        xAxis.scale(xOrdinal);
        d3.select("#xAxis")
            .attr("transform", "translate(" + x_offset + "," + (barcont_height-y_offset) + ")")
            .transition()
            .duration(transition_speed)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.5em")
            .attr("dy", "-.1em")
            .attr("transform", "rotate(-90)");


        let yAxis = d3.axisLeft();
        yAxis.scale(yScale);
        d3.select("#yAxis")
            .transition()
            .duration(transition_speed)
            .attr("transform", "translate(" + (x_offset -5) + ",0)")
            .call(yAxis);


        // Create the bars (hint: use #bars)
        let bars = d3.select("#bars")
            .selectAll("rect").data(this.allData)

        bars.exit().remove()

        bars = bars.enter().append("rect")
            .merge(bars)

        bars
            .attr("x",function (d,i) {
                return x_offset + xScale((i)+1);
            })
            .classed("selected",false)
            .attr("y",  y_offset)
            .attr("width",bar_width)
            .transition()
            .duration(transition_speed)
            .style("opacity", 1)
            .attr("height",function (d) {
                return barcont_height- y_offset - yScale(d[selectedDimension]);
            })
            .style("fill", function (d) {
                return colorScale(d[selectedDimension]);
            })

        ;





        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    bars
        .on("click", function (d) {
            d3.select(".selected")
                .classed("selected", false)
                .style("fill", function (d) {
                return colorScale(d[selectedDimension]);
            });
            d3.select(this).classed("selected",true)
                .style("fill","");

            window.infoPanel = new InfoPanel();
            window.map = new Map();
            infoPanel.updateInfo(d);
            map.updateMap(d);
        })
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        let chosen_data = document.getElementById("dataset").value;
        updateBarChart(chosen_data);

    }
}