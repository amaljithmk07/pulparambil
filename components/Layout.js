import React, { useEffect, useState } from "react";




const Layout = (props) => {





    return (
        <React.Fragment>
            <main
                id="main-element"
                className={`main`}
            >

                <head>
                    <title>Pulparambil</title>
                    <meta name="description" content="MindFlow is a trusted companion for women, helping you track your period cycles and care for your mental health. Like an intimate friend, always here for your well-being." />

                    <link rel="icon" href="/favicon.ico" sizes="any" />

                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta charSet="UTF-8" />
                </head>

                {/* < Header /> */}
                {props.children}
                {/* <Footer /> */}
            </main>
        </React.Fragment>
    );
};

export default Layout;