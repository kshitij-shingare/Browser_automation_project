// Autonomous Assessment & Quiz Solver for DADB Academy
// Developed by Kshitij Shingare
// High-precision knowledge base covering IoT, Protocols, Architecture, IIoT, CAD, and Robotics

function getAnswerForQuestion(questionText, options) {
  const q = questionText.toLowerCase();
  const matches = [];

  for (const opt of options) {
    const text = opt.text.trim();
    const t = text.toLowerCase();
    let score = 0;

    // --- IoT Core & Protocols ---
    if (q.includes('mqtt-sn') && q.includes('stand for')) {
      if (t.includes('sensor network')) score += 30;
    }
    if (q.includes('sparkplug') && q.includes('eon')) {
      if (t.includes('edge of network')) score += 30;
    }
    if (q.includes('sparkplug') && q.includes('point-to-point')) {
      if (t === 'false') score += 35;
    }
    if (q.includes('pubsub') || q.includes('publish') || q.includes('subscribe')) {
      if (t.includes('space and time decoupling') || t.includes('decoupling') || t.includes('many-to-many')) score += 25;
    }
    if (q.includes('broker') && q.includes('role')) {
      if (t.includes('manage traffic flow') || t.includes('compliance') || t.includes('publishing and subscribing')) score += 25;
    }
    if (q.includes('integral') && q.includes('sparkplug')) {
      if (t.includes('mqtt server') || t.includes('edge of network') || t.includes('scada/iot host')) score += 25;
    }
    if (q.includes('lwm2m') && (q.includes('encoding') || q.includes('resource'))) {
      if (t.includes('binary')) score += 30;
    }
    if (q.includes('smart grid') && q.includes('layer')) {
      if (t.includes('service management layer')) score += 30;
    }
    if (q.includes('network slicing') && q.includes('5g')) {
      if (t.includes('dedicated virtual networks')) score += 30;
    }
    if (q.includes('iso osi') || q.includes('transport layer')) {
      if (t.includes('sessions') || t.includes('end-to-end') || t.includes('establishing, maintaining')) score += 25;
    }
    if (q.includes('opc ua') && q.includes('cloud')) {
      if (t === 'false') score += 30;
    }
    if (q.includes('opc ua') && (q.includes('both client-server') || q.includes('adaptable'))) {
      if (t === 'true' || t === 'false') score += 15;
    }
    if (q.includes('opc ua') && q.includes('transport') && q.includes('tcp')) {
      if (t === 'false') score += 30;
    }
    if (q.includes('abac') && q.includes('single attribute')) {
      if (t === 'false') score += 35;
    }
    if (q.includes('mqtt') && q.includes('encryption')) {
      if (t.includes('without additional protocols') || t.includes('tls')) score += 20;
    }
    if (q.includes('mioty') && q.includes('battery')) {
      if (t.includes('10 year')) score += 35;
    }
    if (q.includes('sigfox') && q.includes('range')) {
      if (t.includes('20-30') || t.includes('urban')) score += 25;
    }
    if (q.includes('lorawan') && q.includes('eirp')) {
      if (t.includes('10 dbm') || t.includes('14 dbm') || t.includes('16 dbm')) score += 25;
    }
    if (q.includes('spreading factor') && q.includes('lora')) {
      if (t.includes('bits per symbol')) score += 30;
    }
    if (q.includes('802.15.4') && q.includes('addressing')) {
      if (t.includes('uri') || t.includes('short') || t.includes('extended')) score += 25;
    }
    if (q.includes('smart meter')) {
      if (t.includes('measure and transmit energy usage')) score += 30;
    }
    if (q.includes('predictive capabilities') || q.includes('predictive maintenance')) {
      if (t.includes('forecasting') || t.includes('future production needs')) score += 30;
    }
    if (q.includes('frame port') && q.includes('lorawan')) {
      if (t.includes('specify the application port')) score += 30;
    }
    if (q.includes('websockets')) {
      if (q.includes('transport') && t.includes('both text and binary')) score += 25;
      if (q.includes('not a feature') && (t.includes('native push') || t.includes('half-duplex'))) score += 25;
    }
    if (q.includes('feedback loop')) {
      if (t.includes('continuous improvement of system operations') || t.includes('error correction')) score += 30;
    }
    if (q.includes('rami 4.0') && q.includes('layer')) {
      if (t.includes('communication layer') || t.includes('information layer') || t.includes('business layer')) score += 25;
    }

    // --- Automation Architectures & Fieldbus ---
    if (q.includes('single control unit') || (q.includes('centralized') && q.includes('what type'))) {
      if (t === 'centralized') score += 30;
    }
    if (q.includes('decentralized') && q.includes('fail')) {
      if (t.includes('another unit takes over') || t.includes('remains functional') || t.includes('continue')) score += 25;
    }
    if (q.includes('distributed') && (q.includes('advantage') || q.includes('benefit'))) {
      if (t.includes('scalability') || t.includes('fault tolerance') || t.includes('modular') || t.includes('flexibility') || t.includes('reduced need for administration')) score += 25;
    }
    if (q.includes('centralized') && (q.includes('drawback') || q.includes('disadvantage') || q.includes('limitation'))) {
      if (t.includes('single point of failure') || t.includes('higher ongoing costs') || t.includes('wiring') || t.includes('vulnerability')) score += 25;
    }
    if (q.includes('fieldbus devices') && q.includes('lower levels')) {
      if (t.includes('low data rate per device')) score += 25;
    }
    if (q.includes('reliability') && q.includes('communication systems')) {
      if (t.includes('reliability')) score += 30;
    }

    // --- IIoT Platforms & Cloud (AWS, Greengrass, Gartner) ---
    if (q.includes('aws') && (q.includes('edge') || q.includes('local'))) {
      if (t.includes('greengrass')) score += 35;
    }
    if (q.includes('aws') && q.includes('security')) {
      if (t.includes('device defender')) score += 35;
    }
    if (q.includes('aws') && q.includes('message broker')) {
      if (t.includes('publishing and subscribing to messages')) score += 35;
    }
    if (q.includes('aws') && q.includes('cloud-based') && (q.includes('benefit') || q.includes('scalab'))) {
      if (t.includes('unlimited scalability')) score += 35;
    }
    if (q.includes('hybrid') && q.includes('cloud')) {
      if (t.includes('combination of public and private')) score += 35;
    }
    if (q.includes('gartner') && q.includes('platform')) {
      if (t.includes('cloud and on-premises')) score += 30;
    }
    if (q.includes('role of data analytics') || (q.includes('data analytics') && q.includes('platform'))) {
      if (t.includes('analyzing and generating value') || t.includes('insights')) score += 30;
    }
    if (q.includes('common application') && q.includes('iot platform')) {
      if (t.includes('monitoring and controlling industrial equipment')) score += 30;
    }
    if (q.includes('normalization') || q.includes('data normalization')) {
      if (t.includes('simplifies raw data processing') || t.includes('standardized format') || t.includes('consistent analysis')) score += 30;
    }
    if (q.includes('edge computing') || q.includes('fog')) {
      if (t.includes('low latency') || t.includes('local processing') || t.includes('bandwidth') || t.includes('intermediate layer')) score += 25;
    }
    if (q.includes('dashboard') && q.includes('mqtt')) {
      if (t.includes('visualization of sensor data on a dashboard')) score += 30;
    }

    // --- Product Development, FMEA, Design Thinking ---
    if (q.includes('fmea') && q.includes('risk priority number')) {
      if (t.includes('immediate corrective action')) score += 35;
    }
    if (q.includes('design thinking') && (q.includes('formulating') || q.includes('challenge') || q.includes('point-of-view'))) {
      if (t.includes('point-of-view') || t.includes('taking a point-of-view')) score += 35;
    }
    if (q.includes('digitalization') && q.includes('disadvantage')) {
      if (t.includes('limited ability to simulate real-world conditions')) score += 30;
    }
    if (q.includes('product life cycle') || q.includes('lifecycle')) {
      if (t.includes('introduction') || t.includes('growth') || t.includes('maturity') || t.includes('decline') || t.includes('development')) score += 25;
    }
    if (q.includes('house of quality') || q.includes('qfd')) {
      if (t.includes('customer requirements') || t.includes('engineering') || t.includes('matrix')) score += 25;
    }
    if (q.includes('cost reduction') || q.includes('dfma')) {
      if (t.includes('dfma') || t.includes('standardization') || t.includes('early design phase') || t.includes('reducing part count')) score += 25;
    }

    // --- CAD & Generative Manufacturing ---
    if (q.includes('cad') && (q.includes('3d') || q.includes('printing'))) {
      if (t.includes('stl')) score += 35;
    }
    if (q.includes('cad') && q.includes('2d vector')) {
      if (t.includes('dxf') || t.includes('dwg')) score += 30;
    }
    if (q.includes('iges') && q.includes('disadvantage')) {
      if (t.includes('detailed textures') || t.includes('large file size')) score += 30;
    }
    if (q.includes('layers') && q.includes('cad')) {
      if (t.includes('organization and clarity')) score += 30;
    }
    if (q.includes('cnc') && q.includes('cad')) {
      if (t.includes('direct creation of workpieces from digital designs')) score += 30;
    }

    // --- Robotics & Kinematics ---
    if (q.includes('robot') && q.includes('distinguishes') && q.includes('traditional')) {
      if (t.includes('adapt and interact with the environment')) score += 35;
    }
    if (q.includes('sensors in a robot') || (q.includes('sensors') && q.includes('robotic systems'))) {
      if (t.includes('interact with the environment') || t.includes('collect data from the environment')) score += 30;
    }
    if (q.includes('actuators') && q.includes('robot')) {
      if (t.includes('perform physical actions') || t.includes('motion')) score += 30;
    }
    if (q.includes('kinematic model') || q.includes('kinematic')) {
      if (t.includes('motion without forces') || t.includes('position and orientation') || t.includes('joint angles')) score += 25;
    }
    if (q.includes('dynamic model') && q.includes('forces')) {
      if (t.includes('forces acting on a robot') || t.includes('forces and torques')) score += 30;
    }
    if (q.includes('sensor-based model') && (q.includes('manipulate') || q.includes('environment'))) {
      if (t.includes('sensor-based model')) score += 30;
    }
    if (q.includes('integrating kinematic, dynamic') || q.includes('benefit of integrating')) {
      if (t.includes('operate autonomously and handle complex tasks')) score += 35;
    }
    if (q.includes('safety of robotic systems') || (q.includes('safety') && q.includes('robot'))) {
      if (t.includes('speed optimization') || t.includes('collision avoidance') || t.includes('power and force limiting')) score += 25;
    }
    if (q.includes('machine learning') && q.includes('robotic')) {
      if (t.includes('autonomous decision-making')) score += 35;
    }
    if (q.includes('scalability of robotic systems')) {
      if (t.includes('energy consumption') || t.includes('modular design')) score += 25;
    }
    if (q.includes('industry heavily relies on robotic systems')) {
      if (t.includes('manufacturing')) score += 35;
    }
    if (q.includes('healthcare') && q.includes('robotics')) {
      if (t.includes('medical record management') || t.includes('surgical assistance')) score += 30;
    }

    // --- General Smart Multiple-Choice Fallbacks ---
    if (t.includes('all of the above') || t.includes('all the above')) score += 8;
    if (t.includes('both a and b') || t.includes('both b and c')) score += 7;

    matches.push({ opt, score });
  }

  matches.sort((a, b) => b.score - a.score);

  if (matches.length > 0 && matches[0].score > 0) {
    const top = matches.filter(m => m.score >= 20).map(m => m.opt);
    return top.length > 0 ? top : [matches[0].opt];
  }

  // Fallback: pick option with the most comprehensive technical detail
  if (options && options.length > 0) {
    const sorted = [...options].sort((a, b) => b.text.length - a.text.length);
    return [sorted[0]];
  }
  return [];
}

module.exports = {
  getAnswerForQuestion
};
