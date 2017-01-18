window.onload = function () {

    VIGNETTE_X = 66;
    VIGNETTE_Y = 64;
    VIGNETTE_SX = 1.87;
    VIGNETTE_SY = 1.80;
    CARD_SX = 0.5;
    CARD_SY = 0.5;
    AP_X = 54;
    AP_Y = 40;
    ATK_X = 308 + 4;
    ATK_Y = 34 + 8;
    HP_X = 368 + 4;
    HP_Y = 34 + 8;
    MP_X = 346 + 2;
    MP_Y = 74 + 10;
    NAME_X = 223;
    NAME_Y = 314;
    FAMILY_Y = 526;
    DESC_Y = 380;

    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });

    var app = new Vue({
        el: "#app",
        data: {
            loaded: false,
            bar: document.getElementById("progress-bar"),
            vignetteBar: document.getElementById("progress-bar-v"),
            classes: ["Neutre", "Cra", "Ecaflip", "Eniripsa", "Iop", "Sacrieur", "Sadida", "Sram", "Xelor"],
            rarities: ["Commune", "Peu commune", "Rare", "Krosmique", "Infinite Nv1", "Infinite Nv2", "Infinite Nv3"],
            types: ["Créature", "Sort"],
            vignetteCategories: ["Tokens", "Neutre", "Infinite", "Cra", "Ecaflip", "Eniripsa", "Iop",
                "Sacrieur", "Sadida", "Sram", "Xelor"],
            selectedType: "Créature",
            selectedRarity: "Commune",
            selectedClass: "Neutre",
            selectedVignetteCateg: "Tokens",
            selectedEffect: "",
            vignettesLoaded: {},
            vignette: {
                x: 0, y: 0, scale: {
                    x: 1, y: 1
                }
            },
            vignettesTextures: {},
            vignetteCustomLink: "",
            cardName: "",
            cardExt: "",
            cardFamily: "",
            cardAtk: 0,
            cardHP: 0,
            cardMP: 0,
            cardAP: 0,
            cardDescription: "",
            showGameVignettes: false,
            showCustomVignette: false
        },
        methods: {
            getClassImg: function () {
                return "classe_" + this.selectedClass.toLowerCase() + ".png";
            },
            getTypeImg: function () {
                return "type_" + this.selectedType.toLowerCase() + ".png";
            },
            whenTypeSelected: function () {
                if (this.selectedType === "Sort") {
                    this.ATKText.visible = false;
                    this.HPText.visible = false;
                    this.MPText.visible = false;
                    this.vignette.y = VIGNETTE_Y - 6;
                    this.updateCropper();
                } else {
                    this.ATKText.visible = true;
                    this.HPText.visible = true;
                    this.MPText.visible = true;
                    this.vignette.y = VIGNETTE_Y;
                }
                this.updateCardImage();
            },
            whenRaritySelected: function () {
                this.updateGemmeImage();
                //if (this.selectedRarity.toLowerCase().match("infinite"))
                this.updateCardImage();
            },
            whenClassSelected: function () {
                this.updateCardImage();
            },
            getCardImgName: function () {
                if (this.selectedRarity.toLowerCase().match("infinite"))
                    return this.selectedRarity.toLowerCase();
                return this.selectedClass.toLowerCase() + "_" +
                    this.selectedType.toLowerCase() + "_" + "commune"; // this.selectedRarity.toLowerCase()
            },
            getGemmeImgName: function () {
                if (this.selectedRarity.toLowerCase().match("infinite"))
                    return "gemme_commune";
                return "gemme_" + this.selectedRarity.toLowerCase();
            },
            updateCardImage: function () {
                var name = "img/cartes/" + this.getCardImgName() + ".png";
                this.card.texture = PIXI.loader.resources[name].texture;
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            updateGemmeImage: function () {
                var name = "img/gemmes/" + this.getGemmeImgName() + ".png";
                this.gemme.texture = PIXI.loader.resources[name].texture;
                this.gemme.x = NAME_X - this.gemme.width / 2;
                this.gemme.y = name.includes("peu commune") ? 22 : 12;
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenAPChanged: function () {
                this.APText.text = String(this.cardAP);
                if (this.cardAP > 9)
                    this.APText.x = AP_X - 16;
                else
                    this.APText.x = AP_X;
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenATKChanged: function () {
                this.ATKText.text = String(this.cardAtk);
                if (this.cardAtk > 9) {
                    this.ATKText.x = ATK_X - 16;
                    this.ATKText.y = ATK_Y + 10;
                    this.ATKText.style.fontSize = '42px';
                }
                else {
                    this.ATKText.x = ATK_X;
                    this.ATKText.y = ATK_Y;
                    this.ATKText.style.fontSize = '50px';
                }
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenHPChanged: function () {
                this.HPText.text = String(this.cardHP);
                if (this.cardHP > 9) {
                    this.HPText.x = HP_X - 16;
                    this.HPText.y = HP_Y + 10;
                    this.HPText.style.fontSize = '42px';
                }
                else {
                    this.HPText.x = HP_X;
                    this.HPText.y = HP_Y;
                    this.HPText.style.fontSize = '50px';
                }
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenMPChanged: function () {
                this.MPText.text = String(this.cardMP);
                if (this.cardMP > 9) {
                    this.MPText.x = MP_X - 18;
                    this.MPText.y = MP_Y + 10;
                    this.MPText.style.fontSize = '42px';
                }
                else {
                    this.MPText.x = MP_X;
                    this.MPText.y = MP_Y;
                    this.MPText.style.fontSize = '50px';
                }
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenNameChanged: function () {
                this.NameText.text = this.cardName;
                this.NameText.x = NAME_X - this.NameText.width / 2;
                this.NameText.y = NAME_Y;
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            whenFamilyChanged: function () {
                this.FamilyText.text = this.cardFamily;
                this.FamilyText.x = NAME_X - this.FamilyText.width / 2;
                this.FamilyText.y = FAMILY_Y;
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            blankVignette: function () {
                this.vignette.visible = false;
                this.showGameVignettes = false;
                this.showCustomVignette = false;
                this.renderer.render(this.stage);
            },
            gameVignettes: function () {
                this.showGameVignettes = true;
                this.showCustomVignette = false;
            },
            customVignette: function () {
                this.showGameVignettes = false;
                this.showCustomVignette = true;
            },
            loadVignettes: function () {
                var id = this.selectedVignetteCateg.toLowerCase();
                var div = document.getElementById("gameVignettes-row");
                var counter = 0;
                while (div.children.length > 0)
                    div.removeChild(div.children[0]);
                if (this.cantLoadVignettes()) {
                    this.vignettesTextures[id].forEach((obj) => {
                        var childDiv = document.createElement("div");
                        childDiv.className = "col-lg-2";
                        var img = document.createElement("img");
                        img.setAttribute("class", "vignette-img");
                        img.setAttribute("src", obj.path);
                        childDiv.appendChild(img);
                        $(img).click(app.setGameVignette.bind(app, counter + 1));
                        div.appendChild(childDiv);
                        $(childDiv).animateCss('fadeIn');
                        counter++;
                    });
                    return;
                }
                this.vignettesTextures[id] = [];
                var dir = "img/vignettes/" + id + "/";
                var max = this.getVignettesNumber(id);
                var toLoad = [];
                for (var i = 1; i <= max; i++) {
                    toLoad.push(dir + "v (" + i + ").png");
                }
                console.log("toLoad:", toLoad);
                PIXI.loader
                    .add(toLoad)
                    .on('progress', (l, texture) => {
                        var path = toLoad[counter];
                        if (path) {
                            console.log("path:", path);
                            this.vignettesTextures[id].push({
                                texture: texture,
                                path: path
                            });
                            var childDiv = document.createElement("div");
                            childDiv.className = "col-lg-2";
                            var img = document.createElement("img");
                            img.setAttribute("class", "vignette-img");
                            img.setAttribute("src", path);
                            childDiv.appendChild(img);
                            $(img).click(app.setGameVignette.bind(app, counter + 1));
                            div.appendChild(childDiv);
                            $(childDiv).animateCss('fadeIn');
                            counter++;
                            console.log("counter:", counter);
                        }
                    })
                    .load(() => {
                        app.vignettesLoaded[id] = true;
                    });
            },
            loadCustomVignette: function () {
                PIXI.loader
                    .add(this.vignetteCustomLink)
                    .load(() => {
                        this.vignette.texture = PIXI.loader.resources[this.vignetteCustomLink].texture;
                        this.vignette.visible = true;
                        this.renderer.render(this.stage);
                        $('#render-div').animateCss('pulse');
                    });
            },
            getVignettesNumber: function (categ) {
                switch (categ) {
                    case "tokens":
                        return 17;
                    case "infinite":
                        return 90;
                    case "neutre":
                        return 212;
                    default:
                        return 25;
                }
            },
            setGameVignette: function (index) {
                var dir = "img/vignettes/" + this.selectedVignetteCateg.toLowerCase() + "/";
                var name = dir + "v (" + index + ").png";
                this.vignette.texture = PIXI.loader.resources[name].texture;
                this.vignette.visible = true;
                this.lastVignetteIndex = index;
                this.updateCropper();
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            updateCropper: function() {
                app.cropper.visible = false;
                this.vignette.mask = null;
                if (this.selectedType === "Sort") {
                    app.cropper.position.x = this.vignette.x;
                    app.cropper.position.y = this.vignette.y;
                    app.cropper.scale.x = this.vignette.scale.x;
                    app.cropper.scale.y = this.vignette.scale.y;
                    app.cropper.visible = true;
                    this.vignette.mask = app.cropper;
                }
            },
            cantLoadVignettes: function () {
                return !!this.vignettesLoaded[this.selectedVignetteCateg.toLowerCase()];
            },
            whenVignetteCoordsChanged: function () {
                this.updateCropper();
                this.renderer.render(this.stage);
            },
            whenDescriptionChanged: function () {
                while (this.descriptionContainer.children.length > 0)
                    this.descriptionContainer.removeChild(this.descriptionContainer.children[0]);
                var lines = this.cardDescription.split("\n");
                var x = 0;
                var y = 0;
                lines.forEach((line) => {
                    x = 0;
                    var words = line.split(" ");
                    var lineTxts = [];
                    words.forEach((word) => {
                        var bold = word.startsWith("*") && word.endsWith("*");
                        word = word.replace("*", "").replace("*", "");
                        var txt = new PIXI.Text(word, this.descriptionStyle(bold));
                        txt.x = NAME_X + x;
                        txt.y = DESC_Y + y;
                        this.descriptionContainer.addChild(txt);
                        x += txt.width + 6;
                        lineTxts.push(txt);
                    });
                    var lineWidth = 0;
                    lineTxts.forEach((txt) => {
                        lineWidth += txt.width;
                    });
                    lineTxts.forEach((txt) => {
                        txt.x -= lineWidth / 2;
                    });
                    y += 16 + 6;
                });
                this.renderer.render(this.stage);
                $('#render-div').animateCss('pulse');
            },
            descriptionStyle: function (bold) {
                return {
                    fontFamily: 'Montserrat',
                    fontSize: '28px',
                    fontWeight: bold ? 'bold' : '400',
                    fill: '#000'
                };
            },
            generate: function () {
                this.renderer.render(this.stage);
                var data = this.renderer.view.toDataURL();
                var img = document.getElementById("cardResult");
                img.setAttribute("src", data);
                $(img).animateCss('fadeIn');
            }
        }
    });

    app.renderer = PIXI.autoDetectRenderer(446, 566, { transparent: true });
    app.stage = new PIXI.Container();
    document.getElementById("render-div").appendChild(app.renderer.view);
    var imgsToLoad = [];
    app.classes.forEach((classStr) => {
        app.types.forEach((typeStr) => {
            ["Commune"].forEach((rarityStr) => {
                var str = "img/cartes/" + classStr + "_" + typeStr + "_" + rarityStr + ".png";
                str = str.toLowerCase();
                imgsToLoad.push(str);
            });
        });
    });
    imgsToLoad.push("img/cartes/infinite nv1.png");
    imgsToLoad.push("img/cartes/infinite nv2.png");
    imgsToLoad.push("img/cartes/infinite nv3.png");
    imgsToLoad.push("img/gemmes/gemme_commune.png");
    imgsToLoad.push("img/gemmes/gemme_peu commune.png");
    imgsToLoad.push("img/gemmes/gemme_rare.png");
    imgsToLoad.push("img/gemmes/gemme_krosmique.png");
    imgsToLoad.push("img/gemmes/gemme_infinite nv1.png");
    imgsToLoad.push("img/gemmes/gemme_infinite nv2.png");
    imgsToLoad.push("img/gemmes/gemme_infinite nv3.png");
    imgsToLoad.push("img/vignettes/mask.png");
    PIXI.loader
        .add(imgsToLoad)
        .on('progress', (l, loadedResource) => {
            app.bar.style.width = l.progress + '%';
        })
        .load(setupPixi);
    function setupPixi() {
        app.vignette = new PIXI.Sprite();
        app.card = new PIXI.Sprite(
            PIXI.loader.resources["img/cartes/neutre_créature_commune.png"].texture
        );
        app.gemme = new PIXI.Sprite();
        app.cropper = new PIXI.Sprite(
            PIXI.loader.resources["img/vignettes/mask.png"].texture
        );
        app.cropper.visible = false;
        app.descriptionContainer = new PIXI.Container();

        var style = {
            fontFamily: 'BERNHC',
            fontSize: '72px',
            fontWeight: 'bold',
            fill: '#FFF',
            stroke: '#04849A',
            strokeThickness: 7
        };
        app.APText = new PIXI.Text("0", style);
        style.fontSize = '52px';
        style.stroke = "#895A00";
        style.strokeThickness = 5;
        app.ATKText = new PIXI.Text("0", style);
        style.stroke = "#8C0110";
        app.HPText = new PIXI.Text("0", style);
        style.stroke = "#274600";
        app.MPText = new PIXI.Text("0", style);

        style = {
            fontFamily: 'BERNHC',
            fontSize: '36px',
            fontWeight: 'bold',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 1,
            letterSpacing: 1,
        };
        app.NameText = new PIXI.Text("", style);
        style.fontSize = "28px";
        app.FamilyText = new PIXI.Text("", style);

        app.stage.addChild(app.vignette);
        app.stage.addChild(app.cropper);
        app.stage.addChild(app.card);
        app.stage.addChild(app.gemme);
        app.stage.addChild(app.APText);
        app.stage.addChild(app.ATKText);
        app.stage.addChild(app.HPText);
        app.stage.addChild(app.MPText);
        app.stage.addChild(app.NameText);
        app.stage.addChild(app.FamilyText);
        app.stage.addChild(app.descriptionContainer);

        app.vignette.x = VIGNETTE_X;
        app.vignette.y = VIGNETTE_Y;
        app.vignette.scale.x = VIGNETTE_SX;
        app.vignette.scale.y = VIGNETTE_SY;
        app.card.scale.x = CARD_SX;
        app.card.scale.y = CARD_SY;
        app.APText.x = AP_X;
        app.APText.y = AP_Y;
        app.ATKText.x = ATK_X;
        app.ATKText.y = ATK_Y;
        app.HPText.x = HP_X;
        app.HPText.y = HP_Y;
        app.MPText.x = MP_X;
        app.MPText.y = MP_Y;
        app.gemme.scale.x = 1.2;
        app.gemme.scale.y = 1.2;

        app.updateCardImage();
        app.updateGemmeImage();
        app.loaded = true;
        app.bar.remove();
    }

};