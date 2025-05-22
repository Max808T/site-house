        ymaps.ready(init);

        function init() {
            // Создаем карту с настройками
            var myMap = new ymaps.Map("map", {
                center: [32.149989, -110.835842], // Координаты центра карты
                zoom: 15, // Увеличение
                type: 'yandex#satellite', // Тип карты - спутник
                controls: ['zoomControl', 'typeSelector'] // Элементы управления
            }, {
                searchControlProvider: 'yandex#search'
            });

            // Настройка элементов управления
            myMap.controls.get('zoomControl').options.set({
                size: 'small',
                position: { right: 15, top: 15 }
            });

            // Создаем метку с кастомной иконкой
            var myPlacemark = new ymaps.Placemark([32.149989, -110.835842], {
                balloonContentHeader: '<strong>Turbo House</strong>',
                balloonContentBody: 'ул. Басова, д. 808<br>г. Пима-Каунти',
                balloonContentFooter: 'Работаем круглосуточно'
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
                iconImageSize: [48, 48],
                iconImageOffset: [-24, -48],
                balloonCloseButton: true
            });

            // Добавляем метку на карту
            myMap.geoObjects.add(myPlacemark);

            // Открываем балун автоматически
            myPlacemark.balloon.open();

            // Принудительно устанавливаем тип карты "спутник" (дополнительная проверка)
            myMap.setType('yandex#satellite');
        }