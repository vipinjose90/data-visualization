/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.
        d3.selectAll("#map > circle").remove();
        d3.selectAll("#map > .host")
            .classed("host",false)
        d3.selectAll("#map > .team")
            .classed("team",false)
        d3.selectAll("#map > .silver")
            .classed("silver",false)
        d3.selectAll("#map > .gold")
            .classed("gold",false)

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

        let projectfunc = d3.geoConicConformal().scale(150).translate([400, 350]);

        let runners = d3.select("#map")
            .selectAll(".silver")
            .data([worldcupData.ru_pos])
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projectfunc(d)[0];
            })
            .attr("cy", function (d) {
                return projectfunc(d)[1];
            })
            .attr("r", function (d) {
                return(7);
            })
            .classed("silver",true);

        let winners = d3.selectAll("#map")
            .selectAll(".gold")
            .data([worldcupData.win_pos])
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projectfunc(d)[0];
            })
            .attr("cy", function (d) {
                return projectfunc(d)[1];
            })
            .attr("r", function (d) {
                return(7);
            })
            .classed("gold",true);


        // Select the host country and change it's color accordingly.
        d3.select("#"+worldcupData['host_country_code'])
            .classed("host",true)

        // Iterate through all participating teams and change their color as well.
        for(let team of worldcupData.teams_iso){
            d3.select("#"+team)
                .classed("team",true)
        }

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world,allData) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)



        let path = d3.geoPath()
            .projection(this.projection);

        d3.select("#map").selectAll("path")
            .data(topojson.feature(world,world.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", path)
            .classed("countries",true)
            .attr("id",function (d) {
                return d.id;
            });

        let graticule = d3.geoGraticule();
        d3.select("#map")
            .append("path")
            .datum(graticule)
            .attr('class', "grat")
            .attr('d', path)
            .attr('fill', 'none');

        d3.selectAll(".countries")
            .on("click", function (d) {
                d3.selectAll(".newpanel").remove();
                let newpanel = d3.select("#bar-chart")
                    .append("div")
                    .classed("newpanel",true);
                newpanel
                    .append("div")
                    .classed("xcountry",true)
                    .append("H2")
                    .text(d['id'])
                newpanel
                    .append("div")
                    .classed("xyears",true)
                    .append("H3")
                    .text("Participated in the years: ")
                for(let worldcup of allData){
                    if(worldcup['teams_iso'].indexOf(d['id']) > -1) {
                        d3.select(".xyears")
                            .append("div").text(worldcup['year'])
                    }
                }


            })
    }


}
