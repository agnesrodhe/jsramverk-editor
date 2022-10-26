import Modal from 'react-modal';
import React, { useState } from 'react';
import authModel from '../../models/auth';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#f1d2d4',
        width: '50%',
        },
    };

    Modal.setAppElement('#root');


    function SendEmail({user, addUsers, currentDoc, setChoosenUser}) {
        const [modalIsOpen, setIsOpen] = useState(false);
        const [valueEmail, setValueEmail] = useState({});
        const [submitted, setSubmitted] = useState(true);

        const textInModal = `${user.email} har bjudit in dig att redigera dokumentet ${currentDoc.name}. Tryck på länken för att registrera dig på hemsidan. Därefter får du tillgång till dokumentet. http://www.student.bth.se/~agro21/editor`;

        function openModal() {
            setIsOpen(true);
        }

        function closeModal() {
            setSubmitted(true)
            setIsOpen(false);
        }

        async function sendEmail() {
            const message = {
                to: valueEmail.value,
                from: 'agro21@student.bth.se',
                subject: 'Inbjudan att redigera ett dokument',
                html: `<p>${user.email} har bjudit in dig att redigera dokumentet <strong>${currentDoc.name}</strong>. Tryck på länken för att registrera dig på hemsidan. Därefter får du tillgång till dokumentet.</p><br><a href="http://www.student.bth.se/~agro21/editor">http://www.student.bth.se/~agro21/editor</a>`,
            }
            setSubmitted(false);
            addUsers();
            await authModel.sendEmail(message);
        }

        function handleChange(event) {
            setValueEmail({ value: event.target.value });
            setChoosenUser(event.target.value);
        }
    
        return (
        <div>
            <button className="userBtn" onClick={openModal}>Bjud in</button>
            {submitted ?
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div className="closeDiv">
                <button className="closeBtn" onClick={closeModal}>X</button>
            </div>
            <h2 className='modalTitle'>Bjud in vän att redigera</h2>
            <form className="modalForm">
                <label>E-mail:</label>
                <input type="text" name="email" onChange={handleChange}></input>
                <label>Meddelande med länk:</label>
                <textarea type="textarea" readOnly name="link" value={textInModal} rows="6" cols="50"></textarea>
                <input type="submit" onClick={sendEmail} value="Skicka"></input>
            </form>
            </Modal>
            :
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div className="closeDiv">
                <button className="closeBtn" onClick={closeModal}>X</button>
            </div>
            <h2 className='modalTitle'>Inbjudan skickad!</h2>
            </Modal>
            }
        </div>
        );
    }
export default SendEmail;