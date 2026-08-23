(function () {
  'use strict';

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var node = byId(id);
    if (node && value !== undefined) node.textContent = value;
  }

  function setEyebrow(id, value) {
    var node = byId(id);
    if (!node || !value) return;
    node.replaceChildren(element('span', 'eyebrow__dot'), document.createTextNode(' ' + value));
    node.firstChild.setAttribute('aria-hidden', 'true');
  }

  function setHeading(id, title, emphasis) {
    var node = byId(id);
    if (!node || !title) return;
    node.replaceChildren(document.createTextNode(title + (emphasis ? ' ' : '')));
    if (emphasis) node.appendChild(element('em', '', emphasis));
  }

  function setAddress(id, street, city) {
    var node = byId(id);
    if (!node || !street || !city) return;
    node.replaceChildren(document.createTextNode(street), document.createElement('br'), document.createTextNode(city));
  }

  function serviceCard(service, index) {
    var card = element('article', 'service reveal');
    card.style.setProperty('--d', (index * 0.1) + 's');

    var media = element('div', 'service__media');
    var image = element('img');
    image.src = service.image;
    image.alt = service.imageAlt || service.title || '';
    image.width = 1200;
    image.height = 800;
    image.loading = 'lazy';
    var chip = element('span', 'service__chip', String(index + 1));
    chip.setAttribute('aria-hidden', 'true');
    media.append(image, chip);

    var body = element('div', 'service__body');
    body.append(
      element('p', 'service__index', service.category || ''),
      element('h3', 'service__title', service.title || ''),
      element('p', 'service__desc', service.description || '')
    );
    var list = element('ul', 'service__list');
    (service.bullets || []).forEach(function (item) {
      list.appendChild(element('li', '', item));
    });
    var link = element('a', 'link-arrow', service.buttonLabel || 'Request a free estimate →');
    link.href = '#estimate';
    body.append(list, link);
    card.append(media, body);
    return card;
  }

  function projectCard(project, index) {
    var card = element('article', 'proj reveal');
    card.dataset.cat = project.category || 'residential';
    card.style.setProperty('--d', (index * 0.06) + 's');

    var media = element('div', 'proj__media');
    var image = element('img');
    image.src = project.image;
    image.alt = project.imageAlt || project.title || '';
    image.width = 1600;
    image.height = 1200;
    image.loading = 'lazy';
    media.append(image, element('span', 'proj__pill', project.category || 'Project'));

    var meta = element('div', 'proj__meta');
    meta.append(
      element('h3', 'proj__title', project.title || ''),
      element('p', 'proj__loc', project.location || '')
    );
    card.append(media, meta);
    return card;
  }

  function renderServices(services) {
    var container = byId('servicesCards');
    if (!container || !Array.isArray(services) || !services.length) return;
    container.replaceChildren.apply(container, services.map(serviceCard));
  }

  function renderProjects(projects) {
    var container = byId('gallery');
    if (!container || !Array.isArray(projects) || !projects.length) return;
    container.replaceChildren.apply(container, projects.map(projectCard));
  }

  function renderFaq(items) {
    var container = byId('faqList');
    if (!container || !Array.isArray(items) || !items.length) return;
    var nodes = items.map(function (item, index) {
      var details = element('details');
      if (index === 0) details.open = true;
      details.append(element('summary', '', item.question || ''), element('p', '', item.answer || ''));
      return details;
    });
    container.replaceChildren.apply(container, nodes);
  }

  function applyBusiness(business) {
    if (!business) return;
    document.querySelectorAll('.business-name').forEach(function (node) {
      node.textContent = business.name || node.textContent;
    });
    document.querySelectorAll('.business-tagline').forEach(function (node) {
      node.textContent = business.tagline || node.textContent;
    });
    document.querySelectorAll('[data-phone-text]').forEach(function (node) {
      node.textContent = business.phoneDisplay || node.textContent;
    });
    document.querySelectorAll('[data-phone-link]').forEach(function (node) {
      if (business.phoneTel) node.href = 'tel:' + business.phoneTel;
    });

    setText('topbarAddress', business.topbarAddress);
    setText('topbarHours', business.topbarHours);
    setText('weekHours', business.weekdayHours);
    setText('sundayHours', business.sundayHours);
    setText('footerHours', business.footerHours);
    setText('serviceArea', business.serviceArea);
    setText('insuranceLiability', business.liabilityInsurance);
    setText('insuranceWsib', business.wsibInsurance);
    setAddress('contactAddress', business.streetAddress, business.cityAddress);
    setAddress('footerAddress', business.streetAddress, business.cityAddress);

    var map = byId('contactMap');
    if (map && business.streetAddress && business.cityAddress) {
      var address = business.streetAddress + ', ' + business.cityAddress;
      map.title = 'Map showing ' + (business.name || 'our office') + ' at ' + address;
      map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
    }
  }

  function applyContent(content) {
    applyBusiness(content.business);

    var hero = content.hero || {};
    setEyebrow('heroEyebrow', hero.eyebrow);
    setHeading('heroTitle', hero.title, hero.emphasis);
    setText('heroLead', hero.lead);

    var servicesSection = content.servicesSection || {};
    setEyebrow('servicesEyebrow', servicesSection.eyebrow);
    setHeading('servicesTitle', servicesSection.title, servicesSection.emphasis);
    setText('servicesLead', servicesSection.lead);
    renderServices(content.services);

    var projectsSection = content.projectsSection || {};
    setEyebrow('projectsEyebrow', projectsSection.eyebrow);
    setHeading('projectsTitle', projectsSection.title, projectsSection.emphasis);
    setText('projectsLead', projectsSection.lead);
    renderProjects(content.projects);

    var faq = content.faq || {};
    setEyebrow('faqEyebrow', faq.eyebrow);
    setHeading('faqTitle', faq.title, faq.emphasis);
    renderFaq(faq.items);

    var contact = content.contact || {};
    setEyebrow('contactEyebrow', contact.eyebrow);
    setHeading('contactTitle', contact.title, contact.emphasis);
    setText('contactLead', contact.lead);
  }

  var contentSources = [
    'https://raw.githubusercontent.com/PeterLevin08/RM-General-Contractor/main/content/site.json?refresh=' + Date.now(),
    'content/site.json'
  ];

  function loadContent(sourceIndex) {
    return fetch(contentSources[sourceIndex], { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load website content.');
        return response.json();
      })
      .catch(function (error) {
        if (sourceIndex < contentSources.length - 1) return loadContent(sourceIndex + 1);
        throw error;
      });
  }

  window.siteContentReady = loadContent(0)
    .then(applyContent)
    .catch(function (error) {
      console.warn('Website content could not be loaded; using the built-in copy.', error);
    });
}());