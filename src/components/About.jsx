import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/About.css'; // Import the CSS file

const styles = {
  introTextContainer: {
    margin: 10,
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    fontSize: '1.2em',
    fontWeight: 500,
  },
  introImageContainer: {
    margin: 0,
    justifyContent: 'center',
    display: 'flex',
  },
  images: {
    margin: '5%',
    width: '55%',
    height: '65%',
  },
};

function About(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const parseIntro = (text) => (
    <ReactMarkdown children={text} />
  );

  useEffect(() => {
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        <Container>
          {data ? (
            <Fade>
              {isMobile ? (
                <>
                  <Row>
                    <Col style={styles.introImageContainer} className="intro-image-container">
                      <img
                        src={data?.imageSource}
                        style={styles.images}
                        className="intro-image"
                        alt="profile"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col style={styles.introTextContainer} className="intro-text-container">
                      {parseIntro(data.about)}
                    </Col>
                  </Row>
                </>
              ) : (
                <Row>
                  <Col style={styles.introTextContainer} className="intro-text-container">
                    {parseIntro(data.about)}
                  </Col>
                  <Col style={styles.introImageContainer} className="intro-image-container">
                    <img
                      src={data?.imageSource}
                      style={styles.images}
                      alt="profile"
                    />
                  </Col>
                </Row>
              )}
            </Fade>
          ) : (
            <FallbackSpinner />
          )}
        </Container>
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
