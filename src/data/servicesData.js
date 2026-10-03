/**
 * Daniel Wellness Center (DWC 2.0)
 * Authoritative Service Content Data
 * Source: Daniel_Wellness_Center_Detailed_Service_Content.pdf
 * 
 * Strict fidelity to official documentation:
 * - 01 Reflexology Therapy
 * - 02 Taping Therapy
 * - 03 Ice Bath Therapy
 * - 04 Steam Bath
 * - 05 Cupping Therapy
 * - 06 Bamboo Therapy
 * - Apparatus 01 iROBO Massage Chair
 */

export const servicesData = {
  reflexology: {
    slug: 'reflexology',
    route: '/therapy/reflexology',
    num: '01',
    category: 'NEURO-RESTORATIVE // THERAPY',
    title: 'REFLEXOLOGY THERAPY',
    tagline: 'Restore Balance. Relax Deeply. Feel Refreshed.',
    heroImage: '/images/therapy/modality_01_reflexology_original.png',
    secondaryImage: '/images/recovery/recovery_01_reflexology.png',
    iconType: 'reflexology',
    badgeText: 'ACUPOINT & SOLE STIMULATION',
    imageTag: 'REFLEX STIMULATION // SOLE & ACUPOINTS',
    meta: [
      { label: 'SERVICE', value: 'REFLEXOLOGY' },
      { label: 'EXPERIENCE', value: 'PERSONALIZED' },
      { label: 'APPROACH', value: 'WELLNESS FOCUSED' },
      { label: 'FOCUS', value: 'FEET & ACUPOINTS' }
    ],
    introduction:
      'Reflexology is a relaxing wellness practice that focuses on specific pressure points, particularly on the feet. It is designed to create a calming experience and support overall relaxation. For many people, reflexology becomes a peaceful break from everyday stress, prolonged standing, physical tiredness, and mental tension.',
    whatIsThis:
      'During a reflexology session, controlled pressure and massage-style techniques are applied to selected areas. The experience focuses on comfort and relaxation while helping the client unwind in a calm environment. It can be a suitable wellness choice for people who simply want dedicated time for rest and body relaxation.',
    benefits: [
      'Promotes deep relaxation',
      'May help reduce everyday stress and tension',
      'Supports a sense of overall body comfort',
      'Encourages a calm and peaceful wellness experience',
      'May support circulation through massage-based techniques',
      'Can help people feel refreshed after a busy day'
    ],
    whoIsItFor:
      'Reflexology may appeal to people who spend long hours standing, walking, working at a desk, managing everyday stress, or simply looking for a relaxing wellness experience. Suitability depends on the individual\'s comfort and circumstances.',
    sessionExpectations: [
      {
        step: '01',
        title: 'UNDERSTAND',
        desc: 'Your session begins with an understanding of your comfort and wellness goals.'
      },
      {
        step: '02',
        title: 'PREPARE',
        desc: 'You settle comfortably into a quiet, dedicated therapy sanctuary designed for calm.'
      },
      {
        step: '03',
        title: 'EXPERIENCE',
        desc: 'Controlled pressure and rhythmic massage-style techniques are gently applied to selected reflex zones.'
      },
      {
        step: '04',
        title: 'RELAX',
        desc: 'The experience is intended to be calm, comfortable, and personalized rather than rushed.'
      }
    ],
    whyChooseUs: [
      'Personalized attention',
      'Comfort-focused approach',
      'Professional guidance',
      'Clean and relaxing environment',
      'Easy appointment process'
    ],
    faqs: [
      {
        q: 'How long does a session take?',
        a: 'Session duration can vary depending on the service plan and individual requirements.'
      },
      {
        q: 'Is reflexology painful?',
        a: 'Pressure levels can be adjusted according to your comfort.'
      },
      {
        q: 'Do I need an appointment?',
        a: 'Appointments are recommended for a smoother experience.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'The session is designed around comfort, controlled techniques, and a personalized wellness experience.',
    prevSlug: 'bamboo',
    nextSlug: 'taping'
  },

  taping: {
    slug: 'taping',
    route: '/therapy/taping',
    num: '02',
    category: 'KINESIOLOGY // THERAPY',
    title: 'TAPING THERAPY',
    tagline: 'Support Your Movement. Stay Active With Confidence.',
    heroImage: '/images/therapy/modality_02_taping_original.png',
    secondaryImage: '/images/recovery/recovery_02_taping.png',
    iconType: 'taping',
    badgeText: 'MYOFASCIAL STABILITY PROTOCOL',
    imageTag: 'MYOFASCIAL STABILITY PROTOCOL',
    meta: [
      { label: 'SERVICE', value: 'TAPING THERAPY' },
      { label: 'EXPERIENCE', value: 'MOVEMENT SUPPORT' },
      { label: 'APPROACH', value: 'ANATOMICAL' },
      { label: 'TARGET', value: 'MUSCLES & JOINTS' }
    ],
    introduction:
      'Taping Therapy is a supportive technique that uses specially designed therapeutic tape to provide external support to selected muscles and joints while allowing natural movement. It is commonly considered as part of a broader recovery and movement-support approach.',
    whatIsThis:
      'Depending on individual needs, tape may be applied to areas that require additional support. The application method can vary based on the body area, movement requirements, and the reason for seeking support. A proper assessment and professional guidance are important before deciding on suitability.',
    benefits: [
      'Provides external support to selected areas',
      'May support comfortable movement',
      'Can be considered for active lifestyles and recovery routines',
      'May help provide awareness and support during movement',
      'Allows movement while providing a supportive application'
    ],
    whoIsItFor:
      'This service may be considered by physically active individuals, people seeking additional support during movement, or those following a recovery plan. Individual suitability should always be discussed before application.',
    sessionExpectations: [
      {
        step: '01',
        title: 'ASSESS',
        desc: 'The therapist first understands the area of concern and specific movement needs.'
      },
      {
        step: '02',
        title: 'PREPARE',
        desc: 'The skin is prepared carefully to ensure optimal, safe adherence.'
      },
      {
        step: '03',
        title: 'APPLY',
        desc: 'Therapeutic tape is applied along precise myofascial contours using an appropriate tension technique.'
      },
      {
        step: '04',
        title: 'GUIDE',
        desc: 'You receive guidance about basic care and how long the application is intended to remain in place.'
      }
    ],
    whyChooseUs: [
      'Individual-focused application',
      'Professional guidance',
      'Attention to comfort and movement needs',
      'Supportive approach rather than a one-size-fits-all method'
    ],
    faqs: [
      {
        q: 'Can I move normally with the tape?',
        a: 'The purpose of therapeutic taping often includes allowing movement while providing support, depending on the application.'
      },
      {
        q: 'How long can the tape stay on?',
        a: 'This depends on the type of tape, skin condition, activity level, and professional guidance.'
      },
      {
        q: 'Can everyone use taping therapy?',
        a: 'Suitability varies, especially for people with sensitive skin or certain skin conditions.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'Every application is individually tailored to provide supportive awareness while allowing natural range of motion.',
    prevSlug: 'reflexology',
    nextSlug: 'ice-bath'
  },

  'ice-bath': {
    slug: 'ice-bath',
    route: '/therapy/ice-bath',
    num: '03',
    category: 'CRYOTHERMIC // RECOVERY',
    title: 'ICE BATH THERAPY',
    tagline: 'Refresh Your Body. Reset Your Mind. Support Your Recovery.',
    heroImage: '/images/recovery/recovery_03_ice_bath.png',
    secondaryImage: '/images/therapy/modality_03_ice_cupping_original.png',
    iconType: 'ice-bath',
    badgeText: 'CONTROLLED COLD IMMERSION',
    imageTag: 'THERMAL GRADIENT // SUB-ZERO RECOVERY',
    meta: [
      { label: 'SERVICE', value: 'ICE BATH THERAPY' },
      { label: 'EXPERIENCE', value: 'CRYOTHERMIC' },
      { label: 'APPROACH', value: 'CONTROLLED EXPOSURE' },
      { label: 'FOCUS', value: 'POST-ACTIVITY RESET' }
    ],
    introduction:
      'Ice Bath Therapy uses controlled cold-water exposure as part of a wellness and recovery routine. It has become popular among active individuals and people interested in post-activity recovery experiences.',
    whatIsThis:
      'The experience involves spending a controlled amount of time in cold water under appropriate guidance. Because cold exposure can affect the body significantly, preparation, individual tolerance, and professional supervision are important.',
    benefits: [
      'Provides an intense refreshing experience',
      'Popular as part of post-activity recovery routines',
      'May support a feeling of recovery after physical exertion',
      'Can create a strong sense of mental refreshment',
      'Encourages disciplined breathing and controlled exposure'
    ],
    whoIsItFor:
      'Ice Bath Therapy may be of interest to athletes, fitness enthusiasts, and active individuals. It is not automatically suitable for everyone, and individual health considerations should be discussed before participation.',
    sessionExpectations: [
      {
        step: '01',
        title: 'EXPLAIN',
        desc: 'Before beginning, the process and comfort expectations are thoroughly explained.'
      },
      {
        step: '02',
        title: 'PREPARE',
        desc: 'Guided breathing and mental preparation help settle the nervous system.'
      },
      {
        step: '03',
        title: 'IMMERSE',
        desc: 'The session focuses on controlled exposure and continuous monitoring of individual tolerance.'
      },
      {
        step: '04',
        title: 'REWARM',
        desc: 'Gradual rewarming under guidance. Clients should never feel pressured to continue beyond a safe or comfortable limit.'
      }
    ],
    whyChooseUs: [
      'Guidance-focused approach',
      'Attention to individual tolerance',
      'Clear preparation and session instructions',
      'Recovery and wellness-focused environment'
    ],
    faqs: [
      {
        q: 'Is an ice bath suitable for everyone?',
        a: 'No. Certain health conditions may make cold exposure unsuitable, so professional and medical guidance may be necessary.'
      },
      {
        q: 'How long is the session?',
        a: 'Duration should be determined based on the program, individual tolerance, and appropriate guidance.'
      },
      {
        q: 'What should I do before the session?',
        a: 'Follow the preparation instructions provided by the wellness professional.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'A structured environment centered on personal tolerance, guided breathing, and mindful recovery protocols.',
    prevSlug: 'taping',
    nextSlug: 'steam-bath'
  },

  'steam-bath': {
    slug: 'steam-bath',
    route: '/therapy/steam-bath',
    num: '04',
    category: 'HYDRO-THERMAL // THERAPY',
    title: 'STEAM BATH',
    tagline: 'Step Into Warmth. Leave Feeling Relaxed.',
    heroImage: '/images/therapy/modality_04_steam_bath_original.png',
    secondaryImage: '/images/recovery/recovery_04_steam_bath.png',
    iconType: 'steam-bath',
    badgeText: 'ATMOSPHERIC MIST & ARCHITECTURAL CALM',
    imageTag: 'ATMOSPHERIC MIST // ARCHITECTURAL CALM',
    meta: [
      { label: 'SERVICE', value: 'STEAM BATH' },
      { label: 'EXPERIENCE', value: 'HYDRO-THERMAL' },
      { label: 'APPROACH', value: 'PASSIVE UNWIND' },
      { label: 'ENVIRONMENT', value: 'AMBIENT VAPOR' }
    ],
    introduction:
      'A Steam Bath offers a warm and calming environment designed to help you take a break from daily stress and enjoy a deeply relaxing wellness experience. The warm steam environment can help create a feeling of comfort and encourage the body to unwind.',
    whatIsThis:
      'Steam Bath sessions are often chosen by people looking for relaxation after a busy day, physical activity, or periods of body stiffness. Hydration and individual comfort should always be considered.',
    benefits: [
      'Promotes a deep feeling of relaxation',
      'May help create a sense of looseness in tired muscles',
      'Supports a calming wellness routine',
      'Can be a refreshing self-care experience',
      'Encourages time away from everyday stress'
    ],
    whoIsItFor:
      'This service may be suitable for people seeking relaxation, a calming environment, and a wellness-focused self-care experience. Individual tolerance and health considerations should be discussed where relevant.',
    sessionExpectations: [
      {
        step: '01',
        title: 'HYDRATE',
        desc: 'Hydration is emphasized before entering the thermal suite, along with an orientation to the environment.'
      },
      {
        step: '02',
        title: 'ENTER',
        desc: 'You enter the calm, ambient vapor chamber designed for tranquil isolation and relaxation.'
      },
      {
        step: '03',
        title: 'UNWIND',
        desc: 'Relax for the recommended duration while paying close attention to comfort and gentle breathing.'
      },
      {
        step: '04',
        title: 'RESTORE',
        desc: 'Conclude with a gradual cooling period and post-session hydration. The goal is a calm experience, not prolonged heat exposure.'
      }
    ],
    whyChooseUs: [
      'Comfortable wellness environment',
      'Clear guidance',
      'Focus on relaxation and client comfort',
      'Easy integration with other wellness services'
    ],
    faqs: [
      {
        q: 'How long should I stay in a steam bath?',
        a: 'Duration depends on individual tolerance and professional guidance.'
      },
      {
        q: 'Should I drink water?',
        a: 'Hydration is generally important before and after heat-based wellness experiences.'
      },
      {
        q: 'Can everyone use a steam bath?',
        a: 'Certain health conditions may require medical advice before using heat-based services.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'An architectural sanctuary of ambient warmth created to encourage tension release and mental clarity.',
    prevSlug: 'ice-bath',
    nextSlug: 'cupping'
  },

  cupping: {
    slug: 'cupping',
    route: '/therapy/cupping',
    num: '05',
    category: 'DECOMPRESSION // THERAPY',
    title: 'CUPPING THERAPY',
    tagline: 'Release Tension. Relax Your Body. Support Your Wellness.',
    heroImage: '/images/therapy/modality_06_cupping_original.png',
    secondaryImage: '/images/recovery/recovery_05_cupping.png',
    iconType: 'cupping',
    badgeText: 'MYOFASCIAL DECOMPRESSION',
    imageTag: 'MYOFASCIAL DECOMPRESSION // SUCTION MATRIX',
    meta: [
      { label: 'SERVICE', value: 'CUPPING THERAPY' },
      { label: 'EXPERIENCE', value: 'DECOMPRESSIVE' },
      { label: 'APPROACH', value: 'TARGETED SUCTION' },
      { label: 'FOCUS', value: 'BACK & SHOULDERS' }
    ],
    introduction:
      'Cupping Therapy is a traditional technique that uses specially designed cups placed on selected areas of the body. It is commonly included in wellness routines focused on relaxation, body comfort, and muscle tension release.',
    whatIsThis:
      'The technique creates a suction effect on the skin. Different approaches may be used depending on the service and individual requirements. Before the session, it is important to understand what the experience involves and discuss any concerns.',
    benefits: [
      'May support muscle relaxation',
      'Can be part of a body tension-release routine',
      'May support a feeling of improved body comfort',
      'Often chosen for back and shoulder tension',
      'Provides a unique relaxation experience'
    ],
    whoIsItFor:
      'People experiencing everyday muscle tightness, physical tiredness, or those looking for a traditional wellness experience may be interested in cupping. Individual suitability should always be considered.',
    sessionExpectations: [
      {
        step: '01',
        title: 'DISCUSS',
        desc: 'The therapist discusses your comfort and identifies suitable body areas for the session.'
      },
      {
        step: '02',
        title: 'POSITION',
        desc: 'Specially designed cups are carefully placed on taut muscle zones.'
      },
      {
        step: '03',
        title: 'SUCTION',
        desc: 'A controlled negative-pressure suction effect is created and monitored throughout the experience.'
      },
      {
        step: '04',
        title: 'AFTERCARE',
        desc: 'Cups are gently removed and aftercare guidance is provided. Temporary circular marks can occur depending on the technique.'
      }
    ],
    whyChooseUs: [
      'Professional guidance',
      'Comfort-focused communication',
      'Personalized wellness approach',
      'Clear explanation before the session'
    ],
    faqs: [
      {
        q: 'Will cupping leave marks?',
        a: 'Temporary marks can occur depending on the technique and individual response.'
      },
      {
        q: 'Is cupping painful?',
        a: 'The experience varies, but comfort should be discussed with the therapist.'
      },
      {
        q: 'What should I do after a session?',
        a: 'Follow the aftercare guidance provided for your specific session.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'Traditional decompression techniques targeted at localized muscle tension to support deeper body ease.',
    prevSlug: 'steam-bath',
    nextSlug: 'bamboo'
  },

  bamboo: {
    slug: 'bamboo',
    route: '/therapy/bamboo',
    num: '06',
    category: 'ORGANIC TACTILE // THERAPY',
    title: 'BAMBOO THERAPY',
    tagline: 'Experience the Natural Power of Bamboo. Deep Relaxation Starts Here.',
    heroImage: '/images/therapy/modality_05_bamboo_original.png',
    secondaryImage: '/images/recovery/recovery_06_bamboo.png',
    iconType: 'bamboo',
    badgeText: 'WARM HOLLOW STALKS',
    imageTag: 'WARM HOLLOW STALKS // DEEP TISSUE RELEASE',
    meta: [
      { label: 'SERVICE', value: 'BAMBOO THERAPY' },
      { label: 'EXPERIENCE', value: 'ORGANIC TACTILE' },
      { label: 'APPROACH', value: 'SMOOTH ROLLING' },
      { label: 'PRESSURE', value: 'DEEP & FLOWING' }
    ],
    introduction:
      'Bamboo Therapy is a unique massage-based wellness experience that uses specially designed smooth bamboo tools to apply controlled pressure and flowing movements across different areas of the body. It combines the natural feel of bamboo with massage-style techniques to create a deeply relaxing experience.',
    whatIsThis:
      'Different bamboo tools can be used depending on the body area and desired pressure. The shape and firmness of bamboo allow broad, flowing movements as well as more focused techniques. The experience is designed around relaxation, muscle comfort, and overall rejuvenation.',
    benefits: [
      'Supports deep muscle relaxation',
      'May help reduce feelings of everyday body stiffness',
      'Encourages stress relief and mental relaxation',
      'Massage-based techniques may support circulation',
      'Can be included in post-activity recovery routines',
      'Provides a refreshing full-body wellness experience'
    ],
    whoIsItFor:
      'Bamboo Therapy may appeal to people who enjoy deeper massage-style pressure, experience everyday body tightness, lead physically active lifestyles, or simply want a unique and natural relaxation experience.',
    sessionExpectations: [
      {
        step: '01',
        title: 'UNDERSTAND',
        desc: 'The session begins by understanding your comfort level, pressure preference, and wellness goals.'
      },
      {
        step: '02',
        title: 'SELECT',
        desc: 'Appropriate smooth bamboo tools are chosen based on the targeted muscle groups.'
      },
      {
        step: '03',
        title: 'EXPERIENCE',
        desc: 'Smooth rolling and rhythmic massage-style movements apply firm, even pressure along muscle contours.'
      },
      {
        step: '04',
        title: 'REJUVENATE',
        desc: 'A calming and restorative finish leaving you feeling unburdened and deeply rested.'
      }
    ],
    whyChooseUs: [
      'Personalized pressure based on comfort',
      'Natural bamboo-based wellness experience',
      'Professional guidance',
      'Relaxing and comfortable environment',
      'Individual-focused service recommendations'
    ],
    faqs: [
      {
        q: 'What makes Bamboo Therapy different from a regular massage?',
        a: 'It uses specially designed bamboo tools to create smooth rolling and controlled pressure techniques.'
      },
      {
        q: 'Can pressure be adjusted?',
        a: 'Yes, comfort and pressure preferences should be discussed during the session.'
      },
      {
        q: 'Who may enjoy Bamboo Therapy?',
        a: 'People looking for deeper relaxation, muscle comfort, and a unique massage-style wellness experience may find it appealing.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'The organic firmness of polished bamboo stalks delivers rhythmic, uniform compression for profound muscular release.',
    prevSlug: 'cupping',
    nextSlug: 'reflexology' // Loops back to start of sequence per Requirement 19
  },

  'irobo-massage-chair': {
    slug: 'irobo-massage-chair',
    route: '/services/irobo-massage-chair',
    num: 'APPARATUS 01',
    category: 'FLAGSHIP RECOVERY TECHNOLOGY',
    title: 'IROBO MASSAGE CHAIR',
    tagline: 'High-Fidelity Ergonomics. Somatic Relief. Full-Body Restoration.',
    heroImage: '/images/therapy/irobo_chair_studio_original.png',
    secondaryImage: '/images/cinematic/hero/interpolated/desktop/frame_001.png',
    iconType: 'chair',
    badgeText: 'ZERO-G SOMATIC ALIGNMENT',
    imageTag: 'HIGH FIDELITY ERGONOMICS // SYSTEM 01',
    meta: [
      { label: 'DESIGNATION', value: 'ROBOTIC MASSAGE SUITE' },
      { label: 'ERGONOMICS', value: 'FULL-BODY SCULPTED RECLINE' },
      { label: 'INTEGRATION', value: 'ARMREST CONTROL CONSOLE' },
      { label: 'UPHOLSTERY', value: 'CHARCOAL / METALLIC BRONZE' }
    ],
    introduction:
      'The iROBO Massage Chair is Daniel Wellness Center\'s flagship robotic recovery suite. Designed to provide full-body somatic relief, it merges multi-dimensional robotic massage engineering with an ergonomic zero-gravity sculpted recline to deliver structured physical restoration.',
    whatIsThis:
      'Inside the iROBO suite, clients experience an automated, multi-zone physical recovery session tailored to relieve muscular fatigue from prolonged standing, sedentary desk postures, or intense workouts. Featuring synchronized pneumatic compression and multi-roller kinetic tracking along the spinal curve, the chair decompresses the lumbar spine while elevating the lower limbs to reduce circulatory strain.',
    benefits: [
      'Multi-zone automated mechanical somatic relief',
      'Zero-G neutral spine recline to relieve lumbar pressure',
      'Synchronized pneumatic compression for extremities',
      'Dedicated armrest control console for personal customization',
      'Ideal standalone restoration or pre/post-therapy session'
    ],
    whoIsItFor:
      'Ideal for busy professionals, fitness enthusiasts, athletes, or anyone seeking immediate, uninterrupted physical restoration and deep mental unwinding in an ergonomic sanctuary.',
    sessionExpectations: [
      {
        step: '01',
        title: 'ONBOARD',
        desc: 'Our concierge introduces the suite controls and helps customize your session parameters.'
      },
      {
        step: '02',
        title: 'RECLINE',
        desc: 'The suite transitions smoothly into a zero-gravity ergonomic cradle to alleviate spinal loading.'
      },
      {
        step: '03',
        title: 'RECOVER',
        desc: 'Automated multi-roller kinematics and air pressure cuffs work rhythmically across the full body.'
      },
      {
        step: '04',
        title: 'RESTORE',
        desc: 'Emerge feeling de-stressed, physically aligned, and revitalized.'
      }
    ],
    whyChooseUs: [
      'State-of-the-art robotic suite in Chennai',
      'Private, quiet clinical wellness environment',
      'Seamless pairing with manual therapies and cold/heat recovery',
      'Hygienic, premium sanitized suite protocol'
    ],
    faqs: [
      {
        q: 'How long is an iROBO massage session?',
        a: 'Sessions typically run between 20 to 45 minutes depending on your chosen recovery program.'
      },
      {
        q: 'Can I control the intensity of the massage?',
        a: 'Yes, the integrated armrest console allows continuous adjustment of roller speed, position, and air compression intensity.'
      },
      {
        q: 'Can I combine this with other therapies?',
        a: 'Yes! An iROBO session pairs exceptionally well prior to Reflexology or following a Cold Plunge / Steam Bath.'
      }
    ],
    videoUrl: '',
    videoSupportingText:
      'Experience high-precision mechanized kneading and compression in a zero-gravity posture designed to optimize circulatory recovery.',
    prevSlug: 'bamboo',
    nextSlug: 'reflexology'
  }
};

export const getServiceBySlug = (slug) => {
  return servicesData[slug] || null;
};

export const getAllServices = () => {
  return Object.values(servicesData);
};
