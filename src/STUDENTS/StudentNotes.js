import React, { useEffect, useState } from 'react'
import { StudentDashNavigation } from '../UTILITIES/StudentDashNavigation'
import { Loading } from '../UTILITIES/Loading'
import { auth_CheckSignedIn, firebase_DeleteDocument, firebase_GetAllDocumentsQueried, firebase_GetDocument } from '../Firebase ';
import { removeDuplicates, removeDuplicatesByProperty, sortObjects } from '../Functions';
import '../STYLES/StudentNotes.css'
import { AsyncImage } from '../UTILITIES/AsyncImage';
import ActionButtons from '../UTILITIES/ActionButtons';
import { PrimaryButton } from '../COMPONENTS/PrimaryButton';
import { DestructiveButton } from '../COMPONENTS/DestructiveButton';

export default function StudentNotes() {
    const [loading, setLoading] = useState(false)
    const [notes, setNotes] = useState([]);
    const [me, setMe] = useState({})
    const [toggleAlert, setToggleAlert] = useState(false);
    const [chosenNote, setChosenNote] = useState({});

    function onRemoveNote() {
        setLoading(true)
        firebase_DeleteDocument('Notes', chosenNote.id, (success) => {
            if (success) {
                setToggleAlert(false)
                setNotes((prev) => removeDuplicatesByProperty([...prev.filter((ting) => ting.id !== chosenNote.id)], "id"))
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                await auth_CheckSignedIn(async (person) => {
                    await firebase_GetDocument('Users', person.id, async (thisPerson) => {
                        setMe(thisPerson)
                        await firebase_GetAllDocumentsQueried('Notes', [
                            { field: "UserId", operator: '==', value: thisPerson.id }
                        ], async (notes) => {
                            for (var note of notes) {
                                await firebase_GetDocument('Courses', note.CourseId, (course) => {
                                    const obj = {
                                        ...note,
                                        Course: course.Name
                                    }
                                    console.log(note)
                                    setNotes((prev) =>
                                        removeDuplicatesByProperty([...prev, obj], "id")
                                    );
                                });

                            }
                        });
                    });
                });
            } catch (error) {
                console.error('Error fetching notes:', error);
            } finally {
                setLoading(false); // Ensure this runs after the fetch
            }
        };

        fetchNotes();
    }, []);


    return (
        <div className="student-dash jakarta">
            {loading && <Loading />}
            {toggleAlert && <ActionButtons message={'Are you sure you want to remove this note?'} buttons={[
                { Type: 'cancel', Text: 'Cancel', Func: () => { setToggleAlert(false) } },
                { Type: 'destructive', Text: 'Remove', Func: () => { onRemoveNote() } }
            ]} />}
            <StudentDashNavigation />
            <div className='padding_h'>
                <h1 className="no">Course Notes</h1>
            </div>
            <br />
            <div className="course-notes-wrap">
                {
                    removeDuplicates(notes.map((ting) => ting.Course)).map((courseName, i) => {
                        return (
                            <div key={i}>
                                <p className='no course-notes-course'>{courseName}</p>

                                <div className='course-notes-notes'>
                                    {
                                        sortObjects(notes.filter((ting) => ting.Course === courseName), 'Order', 'asc').map((note, j) => {
                                            return (
                                                <div key={j} className='relative'>
                                                    <div className='bg-white radius shadow note-split'>
                                                        <AsyncImage imagePath={note.SlidePath} width={'100%'} height={'100%'} />
                                                        <p className='course-notes-note no'>{note.Notes.replaceAll("jjj", "\n").split("\n").map((line, index) => (
                                                            <React.Fragment key={index}>
                                                                {line}
                                                                <br />
                                                            </React.Fragment>
                                                        ))}</p>
                                                    </div>
                                                    <div className='separate_h'>
                                                        <div></div>
                                                        <button onClick={() => {
                                                            setChosenNote(note)
                                                            setToggleAlert(true)
                                                        }} className='remove-btn'>remove</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
