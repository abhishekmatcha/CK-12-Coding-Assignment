// Your JS code goes here
const LOCAL_BASE_URL = 'http://localhost:3000';
const CHAPTERS_DATA_URL = `${LOCAL_BASE_URL}/api/book/maths`;

const arrowSideWay = '<svg class="arrow-side" height="14" width="14" stroke-width="2" stroke="#1D1D1D"><path transform="translate(5,1)" d="M0 0 L6 6 L0 12 L6 6 Z"></path></svg>';
const arrowDown = '<svg class="arrow-down" height="10" width="14" stroke-width="2" stroke="#1D1D1D"><path transform="translate(1,2)" d="M0 0 L6 6 L12 0 L6 6 Z"></path></svg>';

/**
 * @name fetchData
 * @function
 * @param { String } url
 * @description: fetch the api and send back the response
 */
fetchData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => 
                response.json())
            .then(data => {
                resolve(data.response);
            })
            .catch(error => {
                reject(error);
            })
    });
}

// fetching the Chapters Data
fetchData(CHAPTERS_DATA_URL)
    .then(response => {
        $(".tabel-wrapper").prepend(renderChaptersData(response.sort((a, b) => (a.sequenceNO > b.sequenceNO) ? 1 : -1)));
        $('.arrow-icon').prepend(arrowSideWay);
    })
    .catch(err => {
        $(".tabel-wrapper").prepend(`<div class='no-data-found'>${err.message}</div>`);
    })


/**
 * @name renderChaptersData
 * @function
 * @param { Array } chaptersData
 * @description: renders the chapter data and returns the elements
 */
renderChaptersData = (chaptersData) => {
    return chaptersData.length ?
        chaptersData.map((eachChapter) => {
            if (eachChapter.type === 'chapter') {
                getLessonsByChapterId(eachChapter.id);
                return `<div id='parent' class='parent-container'>
                        <div class='child-container'  onclick=openLessonsList(${eachChapter.id})>
                            <div class='arrow-icon-${eachChapter.id} arrow-icon'></div>
                            <div class='element'><span>${eachChapter.sequenceNO}.  ${eachChapter.title}</span></div>
                            <progress id="file" value='${eachChapter.completeCount}' max='${eachChapter.childrenCount}'></progress>
                        </div>
                        <div class='lessons-wrapper'>
                            <div id=${eachChapter.id} class='sub-contents-${eachChapter.id} hide-data'></div>
                        </div>
                    </div>`
            }
        }) : `<div class='no-data-found'>NO DATA FOUND<div>`;
}

/**
 * @name renderLessonsData
 * @function
 * @param { Array } lessonsData
 * @description: renders the lesson data and returns the elements
 */
renderLessonsData = (lessonsData) => {
    return lessonsData.length ?
        lessonsData.map((eachLesson) => {
            if (eachLesson.type === 'lesson') {
                return `<div class='sub-data'>
                        <div class='circle'>
                            <svg><circle cx="12" cy="12" r="12" stroke="white" stroke-width="2" fill="white"></circle><circle cx="12" cy="12" r="9" stroke="#273238" stroke-width="2" fill="white"></circle><g></g></svg>
                        </div>
                        <span class='lession-title'>${eachLesson.sequenceNO}.  ${eachLesson.title}</span>
                        ${eachLesson.status === 'COMPLETE'?`<span class='completed'>completed</span>`:''}
                </div>`;
            }
        }) : `<div class='no-data-found'>NO DATA FOUND<div>`;
}



/**
 * @name getLessonsByChapterId
 * @function
 * @param { Number } chapterId
 * @description: fetches the lesson data and adds to the parent
 */
getLessonsByChapterId = (chapterId) => {
    fetchData(`${CHAPTERS_DATA_URL}/section/${chapterId}`)
        .then(response => {
            $(`#${chapterId}`).prepend(renderLessonsData(response[chapterId].sort((a, b) => (a.sequenceNO > b.sequenceNO) ? 1 : -1)));
        })
        .catch(err => {
            $(`#${chapterId}`).prepend(`<div class='no-data-found'>${err.message}</div>`);
        })
}


/**
 * @name openLessonsList
 * @function
 * @param { Number } chapterId
 * @description: opens the lessons data on click of particular chapter
 */
openLessonsList = (chapterId) => {

    // changes the direction of arrow on click
    if ($(`.arrow-icon-${chapterId} svg`).hasClass('arrow-side')) {
        $(`.arrow-icon-${chapterId} svg`).remove();
        $(`.arrow-icon-${chapterId}`).prepend(arrowDown);
    } else {
        $(`.arrow-icon-${chapterId} svg`).remove();
        $(`.arrow-icon-${chapterId}`).prepend(arrowSideWay);
    }

    // hides and shows the chapterlist of particular chapter
    if ($(`.sub-contents-${chapterId}`).hasClass('hide-data')) {
        $(`.sub-contents-${chapterId}`).removeClass('hide-data');
        $(`.sub-contents-${chapterId}`).addClass('show-data');
    } else {
        $(`.sub-contents-${chapterId}`).removeClass('show-data');
        $(`.sub-contents-${chapterId}`).addClass('hide-data');
    }
}
