import Link from 'next/link';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { authenticationIn, authenticationOut } from '../../actions/authentication';


const Header = ({ authStatus, authenticationIn, authenticationOut }) => {
    useEffect(() => {
        window.gapi.load('auth2', function () {
            window.gapi.auth2.init({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
            }).then((googleAuth) => {
                onAuthChange(googleAuth.isSignedIn.get());
                googleAuth.isSignedIn.listen(onAuthChange);
            });
        });
    }, []);


    const onAuthChange = (status) => {
        if (status) {
            const userDetails = {
                userId: window.gapi.auth2.getAuthInstance().currentUser.get().getId(),
                email: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(),
                name: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName(),
                imageUrl: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl(),
            }
            authenticationIn(userDetails);
            // fetchProjects(window.gapi.auth2.getAuthInstance().currentUser.get().getId());
        } else {
            authenticationOut();
        }
    }

    const action = () => {

        if (authStatus.isSignedIn) {
            window.gapi.auth2.getAuthInstance().signOut();
        } else {
            window.gapi.auth2.getAuthInstance().signIn();
        }
    }
    const btnText = authStatus.isSignedIn ? 'Google Sign Out' : 'Google Sign In';

    const renderedItem = () => {
        if (authStatus.isSignedIn) {
            return (
                <>
                    <li>
                        <img src={window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl()} />
                        {window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()}
                    </li>
                </>
            );
        } else return null;
    }

    return (
        <div className="header">
            <div className="container">
                <nav id='main-nav'>
                    <h1><Link href="/"><a >Todo</a></Link></h1>
                    <ul>
                        {renderedItem()}

                        <li><button onClick={() => action()} className='g-signin'>{btnText}</button></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, { authenticationIn, authenticationOut })(Header);
