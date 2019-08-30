class Leg {
    constructor(title, squares) {
        this.title = title
        this.squares = squares
    }
}

class Octopus {
    constructor(legs) {
        this.legs = legs
    }

    // years -- list of years to render ([2019, 2017])
    // headRatio = width / height
    render(svgRootElement, years, headImage, headRatio) {
        // octopus "skill" tooltip
        let tooltipElement = document.getElementById("tooltip");
        // clear svg element so we render octopus from start
        svgRootElement.innerHTML = "";

        let octopusElement = document.createElementNS("http://www.w3.org/2000/svg", "g")
        svgRootElement.appendChild(octopusElement)

        // CONFIGURABLE CONSTANTS
        const scaleIfTooBig = true
        const width = 200
        const height = 150
        const defaultSquareW = 10;
        const defaultSquareH = 10;
        const spaceBetweenLegs = 1;
        const spaceBeforeFirstLeg = 0.5;

        svgRootElement.setAttribute("viewBox", `0 0 ${width} ${height}`)

        // point to last rendered square top left corner
        let curSquareX = 0;
        let curSquareY = 0;

        for (var i = 0; i < this.legs.length; i++) {
            let leg = this.legs[i];
            let legEmpty = true

            for (var j = 0; j < leg.squares.length; j++) {
                let square = leg.squares[j];

                let w = defaultSquareW
                if (square.w != undefined) {
                    w = square.w
                }
                let h = defaultSquareH

                if (!years.includes(square.year)) {
                    continue;
                }

                legEmpty = false

                // create octopus leg square ("skill") and add it to the document
                let squareElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                squareElement.setAttribute("class", "unit");
                squareElement.setAttribute("fill", square.color);
                squareElement.setAttribute("fill-opacity", square.opacity);
                squareElement.setAttribute("x", curSquareX - w);
                squareElement.setAttribute("y", curSquareY);
                squareElement.setAttribute("width", w);
                squareElement.setAttribute("height", h);
                squareElement.addEventListener("mouseover", showSquareTooltipCallback(squareElement, tooltipElement, square.description));
                squareElement.addEventListener("mouseout", hideTooltipCallback(tooltipElement));
                octopusElement.appendChild(squareElement);

                curSquareX -= w + 0.1;
            }

            if (legEmpty) {
                continue;
            }

            // draw leg title
            let legTitleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            legTitleElement.setAttribute("class", "leg-title")
            legTitleElement.innerHTML = leg.title
            legTitleElement.setAttribute("text-anchor", "end")
            legTitleElement.setAttribute("x", curSquareX - 2)
            legTitleElement.setAttribute("y", curSquareY + defaultSquareH / 1.8)
            octopusElement.appendChild(legTitleElement)


            curSquareX = 0
            curSquareY += (defaultSquareH + spaceBetweenLegs);
        }

        // create octopus head
        let legsHeight = (curSquareY - spaceBetweenLegs)
        let headX = 0
        let headY = -spaceBeforeFirstLeg
        let headHeight = legsHeight + spaceBeforeFirstLeg * 2
        let headWidth = headHeight * headRatio

        let headElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
        headElement.setAttribute("x", headX);
        headElement.setAttribute("y", headY);
        headElement.setAttribute("height", headHeight);
        headElement.setAttribute("width", headWidth);
        headElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", headImage);
        octopusElement.appendChild(headElement);

        // align octopus to be at the center of parent svg
        let bb = octopusElement.getBBox()
        let scale = 1
        if (width < bb.width && scaleIfTooBig) {
            scale = width / (bb.width + 15)
        }
        octopusElement.setAttribute("transform", `scale(${scale},${scale}) translate(${-bb.x},${-bb.y})`)
    }
}

function showSquareTooltipCallback(squareElement, tooltipElement, tooltip) {
    return function (event) {
        tooltipElement.innerHTML = tooltip
        tooltipElement.style.display = "block";

        // place tooltip right above the square
        var tooltipRect = tooltipElement.getBoundingClientRect();
        var squareRect = squareElement.getBoundingClientRect();
        squareMid = (squareRect.left + squareRect.right) / 2
        tooltipElement.style.left = (squareMid - tooltipRect.width / 2) + "px"
        tooltipElement.style.top = (squareRect.top - tooltipRect.height - 10 + window.scrollY) + "px";
    }
}

function hideTooltipCallback(tooltip) {
    return function (event) {
        tooltip.style.display = "none";
    }
}

function setupOctopus() {
    let o = new Octopus([
        new Leg('Ведение переговоров', [
            {
                year: 2020, description: '<p>Подготовка к защите дипломного проекта. Если пройду на 3 ступень</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Составление резюме. Собеседование. </p><p> март2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика. Переговоры с клиентом.Понимание задачи. Если перейду на 2 ступень</p><p> январь 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> ноябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> октябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> сентябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },

            { year: 2019, description: '<p>Лекция школы Бюро Горбунова "Переговоры и отношения. Базовые принципы общения."</p><p>1-7 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            { year: 2016, description: '<p>Погружение в работу. Стажировка в FORMA"</p><p>июль 2016</p>', color: "#346b99", opacity: "0.4" },

        ]),
        new Leg('Организованность', [
            {
                year: 2020, description: '<p>План продвижения дипломного проекта. Если пройду на 3 ступень</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> ноябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> октябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> сентябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },

            { year: 2019, description: '<p>Лекция подготовительной школы Бюро Горбунова "Управление собой. Как находить время, справляться с задачами..."</p><p>1-7 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            { year: 2016, description: '<p>Погружение в работу. Стажировка в FORMA"</p><p>июль 2016</p>', color: "#346b99", opacity: "0.4" },
        ]),

        new Leg('Стойкость к критике', [
            {
                year: 2020, description: '<p>Критика по дипломному проекту в мою сторону. Если пройду на 3 ступень</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Критика по практике в мою сторону в шк Бюро Горбунова.</p><p> март 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Критика по практике в мою сторону в шк Бюро Горбунова.</p><p> февраль 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Критика по практике в мою сторону в шк Бюро Горбунова. Если перейду на 2 ступень </p><p> январь 2020</p>',
                color: "#346b99", opacity: "1"
            },

            { year: 2018, description: '<p>Критика во время дипломного проекта"</p><p>февраль-июнь 2019</p>', color: "#346b99", opacity: "0.7" },
            {
                year: 2017,
                description: '<p>Критика во время дизайн-проекта токарного станка</p> <p>сентябрь-декабрь 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2017,
                description: '<p>Критика по дизайн-проекту timescope и ребризера</p> <p>февраль-май 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2016,
                description: '<p>Критика по дизайн-проекту ребризера(подводного дыхательного аппарата) для детей </p> <p>сентябрь-декабрь 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016,
                description: '<p>Критика по дизайн-проекту походной кружки 2к 2сем</p><p>февраль-май 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016,
                description: '<p>Критика по дизайн-проекту штабелера 2к 2сем</p><p>февраль-май 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2015,
                description: '<p>Критика по дизайн-проекту самоката 2к 1сем</p>  <p>сентябрь-декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Критика по дизайн-проекту ледоскалывателя 2к 1сем</p> <p>сентябрь-декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Критика по дизайн-проекту бытовых тисков 1к 2сем</p> <p>февраль-май 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2014,
                description: '<p>Критика по проекту утюга 1ого курса 1 семестра</p><p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },

        ]),
        new Leg('Типографика и вёрстка', [
            {
                year: 2020, description: '<p>Текст к дипломному проекту.Если пройду на 3 ступень</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика. Продающая страница. </p><p> февраль 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика верстка многоэтажной веб-страницы. </p><p> февраль 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика. Вёрстка сложного до-та.</p><p> февраль 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика Принципы вёрстки. Если пройду на 2 ступень</p><p> янвварь 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> ноябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> октябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> сентябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            { year: 2019, description: '<p>Лекция подготовительной школы Бюро Горбунова "Проблемы с текстом"</p><p>15-21 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            { year: 2019, description: '<p>Лекция подготовительной школы Бюро Горбунова "Проблемы с вёрсткой"</p><p>15-21 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            { year: 2019, description: '<p>Лекция подготовительной школы Бюро Горбунова "Отекст о себе"</p><p>8-14 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            { year: 2019, description: '<p>Лекция подготовительной школы Бюро Горбунова "Основные ошибки в тексте"</p><p>1-7 марта 2019</p>', color: "#346b99", opacity: "0.85" },
            {
                year: 2014,
                description: '<p>Лекции и практика по дисциплине "Шрифт" 1ого курса 1 семестра</p> <p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },

        ]),
        new Leg('Информационный дизайн', [
            {
                year: 2020, description: '<p>Изучить Sketch/Figma</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Дипломный проект Бюро Горбунова. Если пройду на 3 ступень</p><p> апрель-май 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Практика интерфейс моб. приложения. </p><p> март 2020</p>',
                color: "#346b99", opacity: "1"
            },

            {
                year: 2020, description: '<p>Практика проектирование сайта. Если пройду на вторую ступень</p><p> янвварь 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Курсовая работа в Бюро Горбунова</p><p> декабрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> ноябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> октябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции в Бюро Горбунова</p><p> сентябрь 2019</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description:
                    '<p>Задание Осьминожка навыков для шк. Бюро Горбунвоав</p> <p>конец августа 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2019,
                description:
                    '<p>Конкурсная работа в шк.Бюро Горбунова. Дизайн приложения продажи билетов на электричку</p> <p>июль-август 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
        ]),
        new Leg('HTML CSS JS', [
            {
                year: 2020,
                description: '<p>Практика ХТМЛ-верстка многоэтажной веб-страницы. Если пройду на вторую ступень</p><p> февраль 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020,
                description: '<p> Пройду книжку "JavaScript для детей"</p><p>2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description:
                    '<p>Учебная работа. Десктопное приложение для прохождения психологических тестов</p> <p>Postgress,VSCode</p><p>апрель-май 2019</p>',
                color: "#346b99", opacity: "0.85"
            },

        ]),
        new Leg('Графический дизайн', [
            {
                year: 2020, description: '<p>Изучить лучше Photoshop</p><p> 2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019, description: '<p>Лекии в подг. шк. Бюро Горбунова. Основы Фотошопа: макет, текст, работа с иллюстрациями</p> <p>1-7 марта 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2019, description: '<p>Логотип, каталог, листовка для магазина с едой</p> <p> AI</p><p>январь 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2018, description: '<p>6 иллюстраций для подкарка. </p> <p>Sketchbook, AI</p><p>Sketchbook, AI</p><p>сентябрь-декабрь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018, description: '<p>Иллюстрации к сайту юр. компании</p> </p> <p>Sketchbook</p><p>сентябрь-декабрь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018, description: '<p>Сайт и логотип, каталог, визитки для юридической компании</p> <p> AI, Photoshop</p><p>сентябрь-декабрь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018, description: '<p>Логотип и лендинг для онлайн-курса по фитнесу</p> <p> AI</p><p>сентябрь-декабрь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2015,
                description: '<p>Логотип для магазина продажи средств для уборки </p> <p> AI</p><p>декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Логотип для компании уборки мусора </p> <p> AI</p><p>сентябрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },

            {
                year: 2015,
                description: '<p>Лекции и практика по дисциплине "Компьютерная графика" 1ого курса 2 семестра</p> <p> AI, Photoshop</p><p>февраль-май 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2014,
                description: '<p>Лекции и практика по дисциплине "Композиция" 1ого курса 1 семестра</p> <p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },
        ]),

        new Leg('Промышленный дизайн', [
            { year: 2020, description: 'Углубить знания в  Fusion 360', color: "#346b99", opacity: "1" },
            { year: 2020, description: 'Изучить поверхностное моделирование SolidWorks', color: "#346b99", opacity: "1" },
            {
                year: 2019,
                description: '<p>Дизайн-проект кошелька</p> <p>июнь 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2018,
                description: '<p>Прочитана книга "Дизайн привычных вещей" Норман</p> <p>январь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018,
                description: '<p>Дипломный проект ребризера для детей с повышенной безопасностью</p> <p> AI, Photoshop, Fusion 360, Keyshot, Marvelous Designer, After Effects,</p><p>февраль-июнь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018,
                description: '<p>Работа в Технопарке Санкт-Петербурга</p><p> Fusion 360, Keyshot, AI</p> <p>февраль-март 2018</p>',
                color: "#346b99", opacity: "0.7"
            },

            {
                year: 2018,
                description: '<p>Стажировка  в Технопарке Санкт-Петербурга</p> <p> Fusion 360, Keyshot, AI</p><p>январь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },

            {
                year: 2017,
                description: '<p>Дизайн-проект токарного станка</p> <p> Fusion 360, Keyshot, AI, Photoshop</p><p>сентябрь-декабрь 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2017,
                description: '<p>Дизайн-проект скутера в команде</p> <p> Fusion 360, Keyshot, 3D`s MAX</p><p>февраль-май 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2017,
                description: '<p>Дизайн-проект timescope и ребризера</p> <p> Fusion 360, Keyshot, AI</p><p>февраль-май 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2016,
                description: '<p>Дизайн-проект ребризера(подводного дыхательного аппарата) для детей </p> <p> Fusion 360,Keyshot,AI</p><p>сентябрь-декабрь 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016,
                description: '<p>Стажировка в FORMA. Проектирование бытовой плиты и овощесушилки</p> <p> SolidWorks,  Keyshot, AI</p><p>июль 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016,
                description: '<p>Дизайн походной кружки 2к 2сем</p> <p> Fusion 360,Keyshot,AI</p> <p>февраль-май 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016,
                description: '<p>Дизайн-проект штабелера 2к 2сем</p><p> SolidWorks,Keyshot,AI</p><p>февраль-май 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2015,
                description: '<p>Дизайн-проект самоката 2к 1сем</p> <p> Fusion 360,Keyshot,AI</p> <p>сентябрь-декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Дизайн ледоскалывателя 2к 1сем</p> <p> Fusion 360,Keyshot,AI</p> <p>сентябрь-декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Учебный проект бытовых тисков 1к 2сем</p> <p> SolidWorks, AI</p> <p>февраль-май 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2014,
                description: '<p>Учебный проект утюга 1ого курса 1 семестра</p> <p> Photoshop </p><p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },
        ]),
        new Leg('Рисунок', [
            {
                year: 2018,
                description: '<p>скетчинг лекции</p> <p>февраль-май 2018</p>',
                color: "#346b99", opacity: "0.7"
            },

            {
                year: 2017, description: '<p>скетчинг</p> <p>сентябрь-декабрь 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2017, description: '<p>Академический рисунок универ</p> <p>февраль-май 2017</p>',
                color: "#346b99", opacity: "0.55"
            },
            {
                year: 2016, description: '<p>скетчинг</p> <p>сентябрь-декабрь 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2015,
                description: '<p>Академический рисунок и живопись в универе</p> <p>февраль-май 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2014,
                description: '<p>Академический рисунок и живопись в универе</p> <p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },
            {
                year: 2014,
                description: '<p>скетчинг в универе</p> <p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },
        ]),
        new Leg('Английский язык', [

            {
                year: 2020,
                description: '<p>Английский репетиторы</p><p>2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020,
                description: '<p>Английский в универе</p><p>2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description: '<p>Английский в универе</p> <p>февраль-май 2019</p>',
                color: "#346b99", opacity: "0.85"
            },

            {
                year: 2018, description: '<p>Английский в универе</p> <p>сентябрь-декабрь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },

            {
                year: 2016, description: '<p>Английский с репетиторами</p> <p>сентябрь-декабрь 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2016, description: '<p>Английский в универе</p> <p>сентябрь-декабрь 2016</p>',
                color: "#346b99", opacity: "0.4"
            },
            {
                year: 2015,
                description: '<p>Английский в Skillset </p> <p>февраль-декабрь 2015</p>',
                color: "#346b99", opacity: "0.25"
            },
            {
                year: 2015,
                description: '<p>Английский в универе</p> <p>февраль-май 2015</p>',
                color: "#346b99", opacity: "0.25"
            },

            {
                year: 2014,
                description: '<p>Английский в универе</p> <p>сентябрь-декабрь 2014</p>',
                color: "#346b99", opacity: "0.1"
            },
        ]),
        new Leg('Немецкий язык', [
            {
                year: 2020,
                description: '<p>Немецкий репетиторы</p><p>2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2018,
                description: '<p>Немецкий с репетиторами</p> <p>февраль-август 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018,
                description: '<p>Немецкий в универе</p> <p>февраль-май 2018</p>',
                color: "#346b99", opacity: "0.7"
            },

            {
                year: 2017, description: '<p>Немецкий в универе</p> <p>сентябрь-декабрь 2017</p>',
                color: "#346b99", opacity: "0.55"
            },


        ]),
        new Leg('Химия', [
            {
                year: 2020,
                description: '<p>Coursera курс Физическая химия</p><p>2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020,
                description: '<p>Coursera курс Неорганическая химия</p><p>2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020,
                description: '<p>Опыты по химии дома</p><p>2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description: '<p>Опыты по химии дома</p><p>август 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            { year: 2018, description: '<p>Лекции и лабы по химии</p><p>сентябрь-декабрь 2018</p>', color: "#346b99", opacity: "0.7" },
            { year: 2018, description: '<p>Глинка "Общая Химия"</p><p>сентябрь-декабрь 2018</p>', color: "#346b99", opacity: "0.7" },
        ]),
        new Leg('Физика', [
            {
                year: 2020, description: '<p>Курс на Stepic</p><p> 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции и лабы по физике</p><p> 2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Теоретическая механика лекции и практика</p><p> 2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description: '<p>Лекции и лабы в универе</p><p>февраль-май 2019</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2018,
                description: '<p>Подготовка к ЕГЭ. Книга "Как всё работает", лекции на youtube</p><p>январь-июнь 2018</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2017,
                description: '<p>Лекции на youtube</p> <p>сентябрь-декабрь 2017</p>',
                color: "#346b99", opacity: "0.55"
            },

        ]),
        new Leg('Математика', [
            {
                year: 2020, description: '<p>Курс на Stepic Введение в математический анализ</p><p> 2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2020, description: '<p>Лекции и практика в универе</p><p> 2019-2020</p>',
                color: "#346b99", opacity: "1"
            },
            {
                year: 2019,
                description: '<p>Лекции и практика в универе</p><p>февраль-май</p>',
                color: "#346b99", opacity: "0.85"
            },
            {
                year: 2018,
                description: '<p>Лекции на youtube</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018,
                description: '<p>Лекции и практика в универе</p>',
                color: "#346b99", opacity: "0.7"
            },
            {
                year: 2018,
                description: '<p>Подготовка к ЕГЭ</p><p>январь-июнь</p>',
                color: "#346b99", opacity: "0.7"
            },
        ])
    ]);
    return o
}


function main() {
    let buttons = {
        2014: document.getElementById("btn-2014"),
        2015: document.getElementById("btn-2015"),
        2016: document.getElementById("btn-2016"),
        2017: document.getElementById("btn-2017"),
        2018: document.getElementById("btn-2018"),
        2019: document.getElementById("btn-2019"),
        2020: document.getElementById("btn-2020"),
    }

    let toggleButtons = function (year) {
        for (y in buttons) {
            if (y <= year) {
                buttons[y].classList.add("pressed")
            } else {
                buttons[y].classList.remove("pressed")
            }
        }
    }

    let octopusSvg = document.getElementById("octopus");
    let octopus = setupOctopus();

    octopus.render(octopusSvg, [2014, 2015, 2016, 2017, 2018, 2019, 2020], 'head3-01.png', 0.795);
    toggleButtons(2020)

    buttons["2014"].onclick = function (e) {
        toggleButtons(2014)
        octopus.render(octopusSvg, [2014], 'head1-01.png', 0.498)
    };

    buttons["2015"].onclick = function (e) {
        toggleButtons(2015)
        octopus.render(octopusSvg, [2014, 2015], 'head1-01.png', 0.498)
    };

    buttons["2016"].onclick = function (e) {
        toggleButtons(2016)
        octopus.render(octopusSvg, [2014, 2015, 2016], 'head1-01.png', 0.498)
    };

    buttons["2017"].onclick = function (e) {
        toggleButtons(2017)
        octopus.render(octopusSvg, [2014, 2015, 2016, 2017], 'head2-01.png', 0.538)
    };

    buttons["2018"].onclick = function (e) {
        toggleButtons(2018)
        octopus.render(octopusSvg, [2014, 2015, 2016, 2017, 2018], 'head2-01.png', 0.538)
    };

    buttons["2019"].onclick = function (e) {
        toggleButtons(2019)
        octopus.render(octopusSvg, [2014, 2015, 2016, 2017, 2018, 2019], 'head2-01.png', 0.538)
    };

    buttons["2020"].onclick = function (e) {
        toggleButtons(2020)
        octopus.render(octopusSvg, [2014, 2015, 2016, 2017, 2018, 2019, 2020], 'head3-01.png', 0.795)
    };
}

window.onload = main
