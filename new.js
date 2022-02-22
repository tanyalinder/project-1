ymaps.ready(init);
var myMap;
var coords; 
var arrayPlaces = (localStorage.getItem('places')) ? JSON.parse(localStorage.places) : [];


function init () {

    var myMap = new ymaps.Map("map", {
        center: [50.46204035394603, 30.520548296461577], 
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search'
    });

            
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="cluster">' +
            '{% for geoObject in properties.geoObjects %}'+
                '<div class="cluster_header">' +
                    '<div class="cluster_name">{{ geoObject.properties.hash.name }}</div>' +
                    '<div class="cluster_place"> [{{ geoObject.properties.hash.place }}]</div>' +
                '</div>'+
                    '<div class="cluster_review">{{ geoObject.properties.hash.review }}</div>' +   
            '{% endfor %}'+
            '</div>'+
            '{% if properties.hash%}'+
            '<div class="cluster">' +
                '<div class="cluster_header">' +
                    '<div class="cluster_name">{{properties.hash.name}}</div>' +
                    '<div class="cluster_place">[{{properties.hash.place}}]</div>' +
                '</div>'+
                    '<div class="cluster_review">{{properties.hash.review}}</div>' +
            '</div>'+
            '{% endif %}'+
            '<div class="review_wrapp">' +
            '<div class="header"><b>Отзыв:</b></div>' +
                '<input class="name" placeholder="Укажите ваше имя"> ' +
                '<input class="place" placeholder="Укажите место"> ' +
                '<textarea class="review" rows="10" cols="45" placeholder="Оставьте отзыв" name="text"></textarea>'+
                '<button id="counter-button">Добавить</button>' +
            '</div>', {
                build: function () {
                    BalloonContentLayout.superclass.build.call(this);
                    document.querySelector('#counter-button').addEventListener('click', this.onCounterClick)
                
                },
                clear: function () {
                    document.querySelector('#counter-button').removeEventListener('click', this.onCounterClick)
                    BalloonContentLayout.superclass.clear.call(this);
                },
    
                onCounterClick: function (e) {
                    var place = {
                            name: document.querySelector('.name').value, 
                            place: document.querySelector('.place').value, 
                            review: document.querySelector('.review').value 
                    }
                    myPlacemark = new ymaps.Placemark(coords, {
                        hash: place
                    }, { balloonContentLayout: BalloonContentLayout}
                    );
                    myMap.geoObjects.events.add('click', (e) => coords = e.get('coords')); 
                    place = {...place, coords}
                    arrayPlaces.push(place)
                    localStorage.setItem('places', JSON.stringify(arrayPlaces));
                     myMap.geoObjects.add(myPlacemark);
                     clusterer.add(myPlacemark);
                     myMap.geoObjects.add(clusterer);
                     balloon.close();
                  
                     
                }
        });
        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayout: BalloonContentLayout
        });

        var balloon = new ymaps.Balloon(myMap, {closeButton: true, maxWidth: 277,
            contentLayout: BalloonContentLayout
        }); 
        balloon.options.setParent(myMap.options);
    
        myMap.events.add('click', function (e) {
            if (!balloon.isOpen()) {
                coords = e.get('coords');
                console.log(coords);

                balloon.open(coords);
            }
            else {
                balloon.close();
            }
            
        });


        if(localStorage.getItem('places')) {
            var initPlaces = JSON.parse(localStorage.places); 
            var myCollection = new ymaps.GeoObjectCollection(); 
            
            initPlaces.forEach(place => {
                myPlacemark = new ymaps.Placemark(place.coords, {
                    hash: {name: place.name, place: place.place, review: place.review}
                }, { balloonContentLayout: BalloonContentLayout}
                )
                myCollection.add(myPlacemark)
                clusterer.add(myPlacemark);
            
        })

        myMap.geoObjects.events.add('click', (e) => coords = e.get('coords'));
        myMap.geoObjects.add(myCollection);
        myMap.geoObjects.add(clusterer);
        
        
        
    }


    
}