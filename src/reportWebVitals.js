// Sert a mesurer la performance du site web.

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // deplacement inattendu des elements
      getFID(onPerfEntry); // temps entre interaction utilisateur et reponse
      getFCP(onPerfEntry); // premier contenu visible
      getLCP(onPerfEntry); // plus grand contenu visible
      getTTFB(onPerfEntry); // delai avant le premier octet du serveur
    });
  }
};

export default reportWebVitals;
