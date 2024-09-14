import React, { useEffect, useState } from 'react'
import StudentNavigation from '../UTILITIES/StudentNavigation'
import { firebase_GetAllDocuments, storage_DownloadMedia } from '../Firebase ';
import { removeDuplicatesByProperty, sortObjects } from '../Functions';
import '../STYLES/StudentDocs.css'
import { Accordion } from '../COMPONENTS/Accordion';
import { FaChevronCircleDown } from 'react-icons/fa';
import SchoolFooter from '../UTILITIES/SchoolFooter';

export default function SchoolDocs() {
    const [tutorialObjects, setTutorialObjects] = useState([]);

    useEffect(() => {
        firebase_GetAllDocuments('SchoolTutorials', (objects) => {
            for (var i = 0; i < objects.length; i += 1) {
                const obj = objects[i];
                storage_DownloadMedia(obj.VideoPath, (video) => {
                    const newObj = {
                        ...obj,
                        VideoUrl: video
                    }
                    setTutorialObjects((prev) => removeDuplicatesByProperty([...prev, newObj], "id"))
                })
            }
        })
    }, [])

    return (
        <div className='main jakarta'>
            <StudentNavigation />
            <div className='body'>
                {
                    sortObjects(tutorialObjects, "Order").map((obj, i) => {
                        return <div className='docs-block' key={i}>
                            <Accordion top={<div className='separate_h align-center'>
                                <h1 className='docs-head no'>{obj.Title}</h1>
                                <FaChevronCircleDown size={26} color='#FF003D' />
                            </div>}
                                bottom={<div>

                                    <p className='docs-details'>{obj.Details}</p>
                                    <video src={obj.VideoUrl} className='docs-video' controls={true} />
                                </div>}
                            />

                        </div>
                    })
                }
            </div>
            <SchoolFooter />
        </div>
    )
}
