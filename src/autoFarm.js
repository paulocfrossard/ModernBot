class AutoFarm extends ModernUtil {
    constructor(c, s) {
        super(c, s);

        // Load the settings
        this.timing = this.storage.load('af_level', 300000);
        this.percent = this.storage.load('af_percent', 1);
        this.hit = this.storage.load('af_hit', 1);
        this.active = this.storage.load('af_active', false);
        this.gui = this.storage.load('af_gui', false);

        // Create the elements for the new menu
        const { $activity, $count } = this.createActivity("url(https://gpit.innogamescdn.com/images/game/premium_features/feature_icons_2.08.png) no-repeat 0 -240px");
        this.$activity = $activity
        this.$count = $count
        this.$activity.on('click', this.toggle)

        this.createDropdown();
        this.updateButtons();

        this.timer = 0;
        this.lastTime = Date.now();
        if (this.active) this.active = setInterval(this.main, 1000);
    }

    /* Create the dropdown menu */
    createDropdown = () => {
        this.$content = $("<div></div>")
        this.$title = $("<p>Modern Farm</p>").css({ "text-align": "center", "margin": "2px", "font-weight": "bold", "font-size": "16px" })
        this.$content.append(this.$title)

        this.$duration = $("<p>Duration:</p>").css({ "text-align": "left", "margin": "2px", "font-weight": "bold" })
        this.$button5 = this.createButton("modern_farm_5", "5 min", this.toggleDuration)
        this.$button10 = this.createButton("modern_farm_10", "10 min", this.toggleDuration).css({ "width": "90px" })
        this.$button20 = this.createButton("modern_farm_20", "20 min", this.toggleDuration).css({ "width": "90px" })
        this.$button40 = this.createButton("modern_farm_40", "40 min", this.toggleDuration).css({ "width": "90px" })// Add 40 min
        this.$button180 = this.createButton("modern_farm_180", "3 Hrs", this.toggleDuration).css({ "width": "80px" }) // Add 3 hours 
        this.$content.append(this.$duration, this.$button5, this.$button10, this.$button20, this.$button40, this.$button180)

        this.$storage = $("<p>Storage:</p>").css({ "text-align": "left", "margin": "2px", "font-weight": "bold" })
        this.$button70 = this.createButton("morden_farm_70", "70%", this.toggleStorage).css({ "with": "80px" }) // Add 70% 
        this.$button80 = this.createButton("modern_farm_80", "80%", this.toggleStorage).css({ "width": "80px" })
        this.$button90 = this.createButton("modern_farm_90", "90%", this.toggleStorage).css({ "width": "80px" })
        this.$button100 = this.createButton("modern_farm_100", "100%", this.toggleStorage).css({ "width": "80px" })
        this.$content.append(this.$storage, this.$button70, this.$button80, this.$button90, this.$button100)

        this.$hit = $("<p>Farm Hit:</p>").css({ "text-align": "left", "margin": "2px", "font-weight": "bold" })
        this.$button_hit50 = this.createButton("modern_farm_hit_50", "50%", this.toggleHit).css({ "width": "80px" })
        this.$button_hit67 = this.createButton("modern_farm_hit_67", "67%", this.toggleHit).css({ "width": "80px" })
        this.$button_hit83 = this.createButton("modern_farm_hit_83", "83%", this.toggleHit).css({ "width": "80px" })
        this.$button_hit100 = this.createButton("modern_farm_hit_100", "100%", this.toggleHit).css({ "width": "80px" })
        this.$content.append(this.$hit, this.$button_hit50, this.$button_hit67, this.$button_hit83, this.$button_hit100)

        this.$gui = $("<p>Gui:</p>").css({ "text-align": "left", "margin": "2px", "font-weight": "bold" })
        this.$guiOn = this.createButton("modern_farm_gui_on", "ON", this.toggleGui)
        this.$guiOff = this.createButton("modern_farm_gui_off", "OFF", this.toggleGui)
        this.$content.append(this.$gui, this.$guiOn, this.$guiOff)

        this.$popup = this.createPopup(423, 480, 220, this.$content)
        this.dropdown_active = false

        // Open and close the dropdown with the mouse
        const close = () => {
            if (!this.dropdown_active) this.$popup.hide()
            this.dropdown_active = false
        }

        const open = () => {
            if (this.dropdown_active) this.$popup.show()
        }

        this.$activity.on({
            mouseenter: () => {
                this.dropdown_active = true
                setTimeout(open, 1000)
            },
            mouseleave: () => {
                this.dropdown_active = false
                setTimeout(close, 50)
            }
        })

        this.$popup.on({
            mouseenter: () => {
                this.dropdown_active = true
            },
            mouseleave: () => {
                this.dropdown_active = false
                setTimeout(close, 50)
            }
        })
    }

    /* Update the buttons */
    updateButtons = () => {
        // Create button for times
        this.$button5.addClass('disabled')
        this.$button10.addClass('disabled')
        this.$button20.addClass('disabled')
        this.$button40.addClass('disabled')
        this.$button180.addClass('disabled')

        // Create button for max storage
        this.$button70.addClass('disabled')
        this.$button80.addClass('disabled')
        this.$button90.addClass('disabled')
        this.$button100.addClass('disabled')

        // Create button for hit to farm
        this.$button_hit50.addClass('disabled')
        this.$button_hit67.addClass('disabled')
        this.$button_hit83.addClass('disabled')
        this.$button_hit100.addClass('disabled')

        if (this.percent_hit == 0.5) this.$button_hit50.removeClass('disabled')
        if (this.percent_hit == 0.67) this.$button_hit67.removeClass('disabled')
        if (this.percent_hit == 0.83) this.$button_hit83.removeClass('disabled')
        if (this.percent_hit == 1) this.$button_hit100.removeClass('disabled')

        if (this.timing == 300000) this.$button5.removeClass('disabled')
        if (this.timing == 600000) this.$button10.removeClass('disabled')
        if (this.timing == 1200000) this.$button20.removeClass('disabled')
        if (this.timing == 2400000) this.$button40.removeClass('disabled') // add 40min
        if (this.timing == 10800000) this.$button180.removeClass('disabled') // add 3h

        if (this.percent == 0.7) this.$button70.removeClass('disabled') // Add button 70%
        if (this.percent == 0.8) this.$button80.removeClass('disabled')
        if (this.percent == 0.9) this.$button90.removeClass('disabled')
        if (this.percent == 1) this.$button100.removeClass('disabled')

        if (!this.active) {
            this.$count.css('color', "red")
            this.$count.text("")
        }

        this.$guiOn.addClass('disabled')
        this.$guiOff.addClass('disabled')
        if (this.gui) this.$guiOn.removeClass('disabled')
        else this.$guiOff.removeClass('disabled')
    }

    toggleHit = (event) => {
        const { id } = event.currentTarget
        if (id == "modern_farm_hit_50") this.percent_hit = 0.5
        if (id == "modern_farm_hit_67") this.percent_hit = 0.67
        if (id == "modern_farm_hit_83") this.percent_hit = 0.83
        if (id == "modern_farm_hit_100") this.ppercent_hit = 1

        // Save the settings and update the buttons
        this.storage.save('af_hit', this.percent_hit);
        this.updateButtons()
    }

    toggleDuration = (event) => {
        const { id } = event.currentTarget

        // Update the timer
        if (id == "modern_farm_5") this.timing = 300_000
        if (id == "modern_farm_10") this.timing = 600_000
        if (id == "modern_farm_20") this.timing = 1_200_000
        if (id == "modern_farm_40") this.timing = 2_400_000 // Add time 40 min
        if (id == "modern_farm_180") this.timing = 10_800_000 // Add time 3h

        // Save the settings and update the buttons
        this.storage.save('af_level', this.timing);
        this.updateButtons()
    }

    toggleStorage = (event) => {
        const { id } = event.currentTarget

        // Update the percent
        if (id == "morden_farm_70") this.percent = 0.7 // Add farm 70%
        if (id == "modern_farm_80") this.percent = 0.8
        if (id == "modern_farm_90") this.percent = 0.9
        if (id == "modern_farm_100") this.percent = 1

        // Save the settings and update the buttons
        this.storage.save('af_percent', this.percent);
        this.updateButtons()
    }


    toggleGui = (event) => {
        const { id } = event.currentTarget

        // Update the gui
        if (id == "modern_farm_gui_on") this.gui = true
        if (id == "modern_farm_gui_off") this.gui = false

        // Save the settings and update the buttons
        this.storage.save('af_gui', this.gui);
        this.updateButtons()
    }

    /* generate the list containing 1 polis per island */
    generateList = () => {
        const islands_list = new Set();
        const polis_list = [];
        let minResource = 0;
        let min_percent = 0;

        const { models: towns } = uw.MM.getOnlyCollectionByName('Town');

        for (const town of towns) {
            const { on_small_island, island_id, id } = town.attributes;
            if (on_small_island || islands_list.has(island_id)) continue;

            // Check the min percent for each town
            const { wood, stone, iron, storage } = uw.ITowns.getTown(id).resources();
            minResource = Math.min(wood, stone, iron);
            min_percent = minResource / storage;

            islands_list.add(island_id);
            polis_list.push(town.id);
            // if (min_percent < this.percent) continue;
        }

        return polis_list;
    };

    toggle = () => {
        if (this.active) {
            clearInterval(this.active);
            this.active = null;
            this.updateButtons();
        }
        else {
            this.updateTimer();
            this.active = setInterval(this.main, 1000);
        }

        // Save the settings
        this.storage.save('af_active', !!this.active);
    };

    /* return the time before the next collection */
    getNextCollection = () => {
        const { models } = uw.MM.getCollections().FarmTownPlayerRelation[0];

        const lootCounts = {};
        for (const model of models) {
            const { lootable_at } = model.attributes;
            lootCounts[lootable_at] = (lootCounts[lootable_at] || 0) + 1;
        }

        let maxLootableTime = 0;
        let maxValue = 0;
        for (const lootableTime in lootCounts) {
            const value = lootCounts[lootableTime];
            if (value < maxValue) continue;
            maxLootableTime = lootableTime;
            maxValue = value;
        }
        const seconds = maxLootableTime - Math.floor(Date.now() / 1000);
        return seconds > 0 ? seconds * 1000 : 0;

    };

    /* Call to update the timer */
    updateTimer = () => {
        const currentTime = Date.now();
        this.timer -= currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update the count
        const isCaptainActive = uw.GameDataPremium.isAdvisorActivated('captain');
        this.$count.text(Math.round(Math.max(this.timer, 0) / 1000));
        this.$count.css('color', isCaptainActive ? "#1aff1a" : "yellow");
    };

    claim = async () => {
        const isCaptainActive = uw.GameDataPremium.isAdvisorActivated('captain');
        const polis_list = this.generateList();

        // If the captain is active, claim all the resources at once and fake the opening
        if (isCaptainActive && !this.gui) {
            await this.fakeOpening();
            await this.sleep(Math.random() * 4000 + 1000); // random between 1 second and 3
            await this.fakeSelectAll();
            await this.sleep(Math.random() * 4000 + 1000);
            if (this.timing <= 600_000) await this.claimMultiple(300, 600);
            if (this.timing > 600_000) await this.claimMultiple(1200, 2400);
            await this.fakeUpdate();

            setTimeout(() => uw.WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(), 2000);
            return;
        }

        if (isCaptainActive && this.gui) {
            await this.fakeGuiUpdate();
            return;
        }

        // If the captain is not active, claim the resources one by one, but limit the number of claims 
        // Human simulate click - Using random time
        let min_sleep = 2000
        let max_sleep = 15000
        let sleep_time = Math.random() * 10000 + 5000
        console.log("Sleep_time " + sleep_time)
        let max = 60;
        const { models: player_relation_models } = uw.MM.getOnlyCollectionByName('FarmTownPlayerRelation');
        const { models: farm_town_models } = uw.MM.getOnlyCollectionByName('FarmTown');
        const now = Math.floor(Date.now() / 1000);
        for (let town_id of polis_list) {
            console.log("tower_id: \n" + town_id)
            let town = uw.ITowns.towns[town_id];
            let x = town.getIslandCoordinateX();
            let y = town.getIslandCoordinateY();

            for (let farm_town of farm_town_models) {
                console.log("Farm number: " + farm_town_models.length)
                console.log("Farm town: \n" + farm_town)
                if (farm_town.attributes.island_x != x) continue;
                if (farm_town.attributes.island_y != y) continue;

                for (let relation of player_relation_models) {
                    if (farm_town.attributes.id != relation.attributes.farm_town_id) continue;
                    if (relation.attributes.relation_status !== 1) continue;
                    if (relation.attributes.lootable_at !== null && now < relation.attributes.lootable_at) continue;

                    this.claimSingle(town_id, relation.attributes.farm_town_id, relation.id, Math.ceil(this.timing / 600_000));
                    await this.sleep(sleep_time);
                    if (!max) return;
                    else max -= 1;
                }
            }
        }

        setTimeout(() => uw.WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(), 2000);
    };

    /* Return the total resources of the polis in the list */
    getTotalResources = () => {
        const polis_list = this.generateList();

        let total = {
            wood: 0,
            stone: 0,
            iron: 0,
            storage: 0,
        };

        for (let town_id of polis_list) {
            const town = uw.ITowns.getTown(town_id);
            const { wood, stone, iron, storage } = town.resources();
            total.wood += wood;
            total.stone += stone;
            total.iron += iron;
            total.storage += storage;
        }

        return total;
    };

    main = async () => {
        // Check that the timer is not too high
        const next_collection = this.getNextCollection();
        if (next_collection && (this.timer > next_collection + 60 * 1_000 || this.timer < next_collection)) {
            this.timer = next_collection + Math.floor(Math.random() * 20_000) + 10_000;
        }

        // Claim resources when timer has passed
        if (this.timer < 1) {
            // Generate the list of polis and claim resources
            this.polis_list = this.generateList();

            // Claim the resources, stop the interval and restart it
            clearInterval(this.active);
            this.active = null;

            await this.claim();
            this.active = setInterval(this.main, 1000);

            // Set the new timer 
            const rand = Math.floor(Math.random() * 20_000) + 10_000;
            this.timer = this.timing + rand;
            if (this.timer < next_collection) this.timer = next_collection + rand;
        }

        // update the timer
        this.updateTimer();
    };

    /* Claim resources from a single polis */
    claimSingle = (town_id, farm_town_id, relation_id, option = 1) => {
        const data = {
            model_url: `FarmTownPlayerRelation/${relation_id}`,
            action_name: 'claim',
            arguments: {
                farm_town_id: farm_town_id,
                type: 'resources',
                option: option,
            },
            town_id: town_id,
        };
        uw.gpAjax.ajaxPost('frontend_bridge', 'execute', data);
    };

    /* Claim resources from multiple polis */
    claimMultiple = (base = 300, boost = 600) =>
        new Promise((myResolve, myReject) => {
            const polis_list = this.generateList();
            let data = {
                towns: polis_list,
                time_option_base: base,
                time_option_booty: boost,
                claim_factor: 'normal',
            };
            uw.gpAjax.ajaxPost('farm_town_overviews', 'claim_loads_multiple', data, false, () => myResolve());
        });

    /* Pretend that the window it's opening */
    fakeOpening = () =>
        new Promise((myResolve, myReject) => {
            uw.gpAjax.ajaxGet('farm_town_overviews', 'index', {}, false, async () => {
                await this.sleep(10);
                await this.fakeUpdate();
                myResolve();
            });
        });

    /* Fake the user selecting the list */
    fakeSelectAll = () =>
        new Promise((myResolve, myReject) => {
            const data = {
                town_ids: this.polislist,
            };
            uw.gpAjax.ajaxGet('farm_town_overviews', 'get_farm_towns_from_multiple_towns', data, false, () => myResolve());
        });

    /* Fake the window update*/
    fakeUpdate = () =>
        new Promise((myResolve, myReject) => {
            const town = uw.ITowns.getCurrentTown();
            const { attributes: booty } = town.getResearches();
            const { attributes: trade_office } = town.getBuildings();
            const data = {
                island_x: town.getIslandCoordinateX(),
                island_y: town.getIslandCoordinateY(),
                current_town_id: town.id,
                booty_researched: booty ? 1 : 0,
                diplomacy_researched: '',
                trade_office: trade_office ? 1 : 0,
            };
            uw.gpAjax.ajaxGet('farm_town_overviews', 'get_farm_towns_for_town', data, false, () => myResolve());
        });

    /* Fake the gui update */
    fakeGuiUpdate = () =>
        new Promise(async (myResolve, myReject) => {
            // Open the farm town overview
            $(".toolbar_button.premium .icon").trigger('mouseenter')
            await this.sleep(1019.39, 127.54)

            // Click on the farm town overview
            $(".farm_town_overview a").trigger('click')
            await this.sleep(1156.65, 165.62)

            // Select all the polis
            $(".checkbox.select_all").trigger("click")
            await this.sleep(1036.20, 135.69)

            // Claim the resources
            $("#fto_claim_button").trigger("click")
            await this.sleep(1036.20, 135.69)

            // Confirm the claim if needed
            const el = $(".confirmation .btn_confirm.button_new")
            if (el.length) {
                el.trigger("click")
                await this.sleep(1036.20, 135.69)
            }

            // Close the window
            $(".icon_right.icon_type_speed.ui-dialog-titlebar-close").trigger("click")
            myResolve();
        });
}
