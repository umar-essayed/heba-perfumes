import type { PerfumeProduct, ShippingZone, Coupon, PaymentSettings } from '../../types/index.ts';

export const INITIAL_PRODUCTS: PerfumeProduct[] = [
  {
    id: 'sauvage',
    name: 'سوفاج | Sauvage',
    tagline: 'منعش وقوي بحضور يلفت الانتباه من غير مبالغة ',
    description: 'عطر بطابع منعش وقوي، يجمع بين الانتعاش واللمسة الرجولية الأنيقة، مع حضور واضح وثبات مميز. مناسب للخروجات والمناسبات وللي بيحب العطور اللي تلفت الانتباه من غير مبالغة.',
    story: 'النوته الأسطورية الأكثر طلباً. توليفة متقنة تجمع بين برغموت كالابريا الحامض مع الفلفل والأمبروكسان لتعطيك حضوراً طاغياً في أي مكان.',
    price: 420,
    originalPrice: 520,
    rating: 4.9,
    reviewsCount: 185,
    isBestSeller: true,
    isFeatured: true,
    image: '/images/perfume-placeholder.jpeg',
    secondaryImages: [
      '/images/perfume-placeholder.jpeg'
    ],
    sizes: [
      { size: '50 مل', price: 420, originalPrice: 520 },
      { size: '100 مل', price: 690, originalPrice: 850 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['برغموت كالابريا', 'الفلفل السيشواني'],
      heart: ['اللافندر الفرنسي', 'نجيل الهند العطري', 'الباتشولي'],
      base: ['الأمبروكسان النقي', 'خشب الأرز الأطلسي', 'اللابدانوم']
    },
    suitableFor: ['خروجات ومناسبات', 'يومي', 'كل الفصول'],
    season: 'كل الفصول',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'invictus',
    name: 'إنفيكتوس | Invictus',
    tagline: 'منعش وحيوي بطابع شبابي جذاب يفضل في الذاكرة ',
    description: 'عطر منعش وحيوي بطابع شبابي جذاب، يجمع بين الانتعاش والحضور القوي مع لمسة أنيقة ومميزة. مناسب للخروجات والاستخدام اليومي، وخصوصًا للي بيحب العطور اللي ريحتها تفضل في الذاكرة.',
    story: 'عطر الانتصارات والطاقة الإيجابية. ميكس بحري منعش مع أوراق الغار وأخشاب الغاياك ليمنحك جاذبية لا تقاوم.',
    price: 390,
    originalPrice: 490,
    rating: 4.8,
    reviewsCount: 130,
    isBestSeller: true,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 390, originalPrice: 490 },
      { size: '100 مل', price: 650, originalPrice: 790 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['نفحات بحرية منعشة', 'الجريب فروت', 'الماندرين'],
      heart: ['أوراق الغار العطرية', 'ياسمين هيديون'],
      base: ['خشب الغاياك', 'الباتشولي', 'طحلب البلوط', 'العنبر']
    },
    suitableFor: ['استخدام يومي', 'خروجات شبابية', 'صيف وربيع'],
    season: 'صيفي وربيعي',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'invictus-elixir',
    name: 'إنفيكتوس إليكسير | Invictus Elixir',
    tagline: 'قوي وفخم بطابع دافئ وثقيل يسيب أثر عميق ',
    description: 'عطر قوي وفخم بطابع دافئ وجذاب، يجمع بين الحلاوة والعمق مع حضور واضح وثبات مميز. مناسب للسهرات والخروجات والمناسبات، وللي بيحب العطور الثقيلة اللي تسيب أثر.',
    story: 'النسخة الأكثر تركيزاً وفخامة من عائلة إنفيكتوس. مزيج ساحر من حبوب التونكا والفانيليا السوداء مع الباتشولي الدافئ.',
    price: 450,
    originalPrice: 560,
    rating: 4.9,
    reviewsCount: 94,
    isBestSeller: false,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 450, originalPrice: 560 },
      { size: '100 مل', price: 750, originalPrice: 920 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['اللافندر المكثف', 'الهيل الدافئ'],
      heart: ['حبوب التونكا', 'اللبان العماني', 'الباتشولي'],
      base: ['الفانيليا السوداء', 'العنبر الفاخر']
    },
    suitableFor: ['سهرات ومناسبات', 'أجواء باردة', 'خروج ليلي'],
    season: 'خريف وشتاء وسهرات',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'khamrah',
    name: 'خمرة | Khamrah',
    tagline: 'عطر دافئ وحلو بطابع شرقي فاخر وثقيل ',
    description: 'عطر دافئ وحلو بطابع شرقي فاخر، يجمع بين التوابل والحلاوة واللمسات الخشبية بشكل جذاب. مناسب للسهرات والمناسبات، وللي بيحب العطور الدافئة والثقيلة اللي ليها حضور قوي.',
    story: 'من أشهر العطور الشرقية السويت التي أحدثت ضجة واسعة. دفء القرفة وجوزة الطيب مع حلاوة التمر والبرالين.',
    price: 460,
    originalPrice: 580,
    rating: 5.0,
    reviewsCount: 220,
    isBestSeller: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 460, originalPrice: 580 },
      { size: '100 مل', price: 780, originalPrice: 950 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['القرفة الملكية', 'جوزة الطيب', 'البرغموت'],
      heart: ['التمر الحلو', 'شوكولاتة البرالين', 'مسك الروم'],
      base: ['الفانيليا الدافئة', 'حبوب التونكا', 'خشب العود والجاوي']
    },
    suitableFor: ['سهرات فاخرة', 'مناسبات كبرى', 'أجواء الشتاء'],
    season: 'شتوي وخريفي',
    gender: 'الاتنين',
    inStock: true
  },
  {
    id: 'khamrah-coffee',
    name: 'خمرة قهوة | Khamrah Coffee',
    tagline: 'رائحة القهوة الغنية مع الحلاوة والتوابل الشرقية ',
    description: 'عطر دافئ وحلو بطابع قهوي جذاب، يجمع بين رائحة القهوة الغنية والحلاوة والتوابل مع لمسة شرقية فاخرة. مناسب للسهرات والأجواء الباردة، وللي بيحب العطور الدافئة والمميزة.',
    story: 'جرعة من الدفء والقهوة المحمصة الفاخرة الممزوجة بحلاوة الكراميل والتوابل العطرية.',
    price: 470,
    originalPrice: 590,
    rating: 4.9,
    reviewsCount: 115,
    isBestSeller: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 470, originalPrice: 590 },
      { size: '100 مل', price: 790, originalPrice: 960 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['القهوة المحمصة', 'القرفة', 'الهيل'],
      heart: ['الكراميل الدافئ', 'جوزة الطيب', 'البرالين'],
      base: ['الفانيليا', 'خشب الصندل', 'العنبر']
    },
    suitableFor: ['سهرات شتوية', 'أجواء باردة', 'خروجات رايقة'],
    season: 'شتاء وخريف',
    gender: 'الاتنين',
    inStock: true
  },
  {
    id: 'silver-scent',
    name: 'سلفر سنت | Silver Scent',
    tagline: 'منعش وأنيق بفوحان جبار وحضور ملوش مثيل ',
    description: 'عطر منعش وأنيق بطابع مميز، يجمع بين الانتعاش واللمسات العطرية الدافئة بشكل جذاب. مناسب للاستخدام اليومي والخروجات، وللي بيحب العطور المنعشة اللي ليها حضور.',
    story: 'عطر الفوحان التاريخي. مزيج زهر البرتقال والليمون مع حبوب التونكا وجوزة الطيب الذي يفرض وجوده من على بعد أمتار.',
    price: 360,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 160,
    isBestSeller: false,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 360, originalPrice: 450 },
      { size: '100 مل', price: 590, originalPrice: 720 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['زهر البرتقال الفريش', 'الليمون الصقلي'],
      heart: ['اللافندر', 'الهيل', 'إكليل الجبل', 'جوزة الطيب'],
      base: ['حبوب التونكا', 'خشب الساج', 'نجيل الهند']
    },
    suitableFor: ['استخدام يومي', 'خروج شبابي', 'كل الأوقات'],
    season: 'كل الفصول',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'crazy-love',
    name: 'كريزي لاف | Crazy Love',
    tagline: 'أنثوي ناعم وحلو يسيب انطباع رومانسي ساحر ',
    description: 'عطر أنثوي جذاب بطابع ناعم وحلو، يجمع بين الرومانسية والأناقة مع لمسة دافئة ومميزة. مناسب للخروجات والمناسبات، وللي بتحب العطور الأنثوية اللي تسيب انطباع حلو.',
    story: 'لمسة من الرقة والجاذبية في زجاجة. نفحات سويت منعشة مع أزهار رقيقة تناسب كل بنت تدور على التميز والنعومة.',
    price: 380,
    originalPrice: 480,
    rating: 4.9,
    reviewsCount: 140,
    isBestSeller: true,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 380, originalPrice: 480 },
      { size: '100 مل', price: 620, originalPrice: 780 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['التوت البري', 'الفواكه الحمراء', 'البرغموت'],
      heart: ['الورد الجوري', 'الياسمين الأبيض', 'زهر البرتقال'],
      base: ['الفانيليا السكرية', 'المسك الأبيض', 'خشب الصندل']
    },
    suitableFor: ['خروجات ومناسبات', 'يومي', 'أجواء رومانسية'],
    season: 'كل الفصول',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'erba-pura',
    name: 'أربا أربابورا | Erba Pura',
    tagline: 'فخامة فاكهية منعشة تخطف الأنظار وتفضل في الذاكرة ',
    description: 'عطر فخم ومنعش بطابع فاكهي جذاب، يجمع بين الانتعاش والحلاوة مع لمسة ناعمة وأنيقة. مناسب للخروجات والمناسبات، وللي بيحب العطور المميزة اللي حضورها واضح وتفضل في الذاكرة.',
    story: 'انفجار من الفواكه المتوسطية والمسك الأبيض والمدغشقري الفاخر. العطر النيش الأشهر في عالم الفخامة.',
    price: 480,
    originalPrice: 600,
    rating: 5.0,
    reviewsCount: 175,
    isBestSeller: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 480, originalPrice: 600 },
      { size: '100 مل', price: 790, originalPrice: 980 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['البرتقال الصقلي', 'البرغموت الكالابري', 'الليمون'],
      heart: ['سلة الفواكه المتوسطية الحلوة'],
      base: ['المسك الأبيض النقي', 'فانيليا مدغشقر', 'العنبر الدافئ']
    },
    suitableFor: ['مناسبات وسهرات', 'صيف وخريف', 'كاريزما خاصة'],
    season: 'كل الفصول والصيف',
    gender: 'الاتنين',
    inStock: true
  },
  {
    id: 'baccarat-rouge',
    name: 'بكرات روج | Baccarat Rouge',
    tagline: 'عطر الأثرياء.. حلو ونظيف مع لمسة أنيقة تلفت الانتباه ',
    description: 'عطر فخم ومميز بطابع حلو ونظيف، يجمع بين النعومة والحضور القوي مع لمسة أنيقة تلفت الانتباه. مناسب للخروجات والمناسبات، وللي بيحب العطور الفخمة اللي ليها شخصية.',
    story: 'العطر الأكثر شهرة وشياكة عالمياً. لمسات غزل البنات الراقي والزعفران والعنبر الخشبي التي تجعل كل من حولك يتساءل عن عطرك.',
    price: 490,
    originalPrice: 620,
    rating: 5.0,
    reviewsCount: 310,
    isBestSeller: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 490, originalPrice: 620 },
      { size: '100 مل', price: 820, originalPrice: 1050 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['الزعفران النقي', 'الياسمين الجرانديفلوروم'],
      heart: ['خشب العنبر (أمبروود)', 'العنبر الرمادي'],
      base: ['راتنج التنوب', 'خشب الأرز المعتق']
    },
    suitableFor: ['سهرات ومناسبات راقية', 'شغل رسمي', 'كل الأوقات'],
    season: 'كل الفصول',
    gender: 'الاتنين',
    inStock: true
  },
  {
    id: 'black-opium',
    name: 'بلاك أوبيوم | Black Opium',
    tagline: 'مزيج حسي ودافئ من القهوة والفانيليا والأزهار البيضاء ',
    description: 'مزيج حسي ودافئ من القهوة والفانيليا والأزهار البيضاء. عطر ساحر ولذيذ بيدي طابع دافئ وغامض، ممتاز للخروجات السريعة والسهرات اللطيفة.',
    story: 'الإغراء والغموض في أبهى صورة. افتتاحية آسرة من القهوة السوداء المنعشة تعقبها حلاوة الفانيليا واللوز الناعم.',
    price: 420,
    originalPrice: 520,
    rating: 4.9,
    reviewsCount: 165,
    isBestSeller: true,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 420, originalPrice: 520 },
      { size: '100 مل', price: 690, originalPrice: 850 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['حبوب القهوة الغنية', 'الكمثرى', 'الفلفل الوردي'],
      heart: ['زهر البرتقال', 'الياسمين', 'اللوز المر'],
      base: ['الفانيليا الدافئة', 'الباتشولي', 'خشب الأرز', 'خشب الكشمير']
    },
    suitableFor: ['سهرات لطيفة', 'خروجات مسائية', 'أجواء باردة'],
    season: 'شتاء وخريف ومساء',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'burberry-her',
    name: 'بربري هير | Burberry Her',
    tagline: 'بناتي ومنعش يجمع حلاوة الفراولة والتوت مع لمسة خشبية ',
    description: 'عطر أنثوي منعش وبناتي جداً، بيجمع بين حلاوة الفواكه الحمراء (الفرولة والتوت) مع لمسة خشبية ناعمة ودافئة. بيدي إحساس بالبهجة والنظافة والأناقة العصرية، ومناسب جداً للخروجات اليومية، الشغل، والاستخدام الصباحي للي بتحب العطور الرقيقة والملفتة في نفس الوقت.',
    story: 'عطر باريسي نابض بالحياة. سويت بناتي رقيق مبهج يجعلك محط الأنظار بنعومته الفائقة.',
    price: 410,
    originalPrice: 510,
    rating: 4.8,
    reviewsCount: 125,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 410, originalPrice: 510 },
      { size: '100 مل', price: 680, originalPrice: 820 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['الفراولة اللذيذة', 'التوت العليق', 'الكرز الأسود'],
      heart: ['الياسمين الناعم', 'البنفسج'],
      base: ['المسك الأبيض', 'العنبر الجاف', 'طحلب السنديان', 'خشب الكشمير']
    },
    suitableFor: ['خروج يومي', 'شغل وصباحي', 'جامعة'],
    season: 'صيف وربيع وكل الأوقات',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'jimmy-choo',
    name: 'جيمي شو | Jimmy Choo',
    tagline: 'أنثوي ساحر بحلاوة التوفي والأوركيد والباتشولي العميق ',
    description: 'عطر أنثوي ساحر بلمسة إغراء دافئة، بيجمع بين حلاوة التوفي والفواكه الاستوائية مع نفحات الأوركيد والباتشولي العميق. بيدي إحساس بالأناقة، الجرأة، والأنوثة الطاغية، ومناسب جداً للمناسبات والسهرات والخروجات المسائية للي بتحب العطور الفواحة اللي ليها بصمة جذابة ومبتتنساش.',
    story: 'أنوثة وجرأة لا تقاوم. سحر التوفي الحلو المتناغم مع الأوركيد الاستوائي.',
    price: 420,
    originalPrice: 520,
    rating: 4.9,
    reviewsCount: 98,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 420, originalPrice: 520 },
      { size: '100 مل', price: 690, originalPrice: 850 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['الكمثرى الإيطالية الحلوة', 'اليوسفي المنعش', 'النوتات الخضراء'],
      heart: ['أزهار الأوركيد النادرة'],
      base: ['التوفي الحلو المقرمش', 'الباتشولي الإندونيسي الدافئ']
    },
    suitableFor: ['سهرات ومناسبات', 'خروج مسائي', 'عزومات خاصة'],
    season: 'كل الفصول وخريف/شتاء',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'davidoff-champion',
    name: 'دافيدوف شامبيون | Davidoff Champion',
    tagline: 'رياضي ومنعش بحيوية الليمون وخشب الأرز وثقة الأبطال ',
    description: 'عطر رياضي ومنعش بامتياز، بيجمع بين حيوية الليمون والبرغموت مع لمسة خشبية ودافئة من خشب الأرز والمهار. بيدي إحساس بالطاقة، النشاط، والثقة بالنفس، ومناسب جداً للاستخدام اليومي، الجيم، والصيف للي بيحب العطور الخفيفة والمنعشة اللي بتفتح النفس.',
    story: 'عطر الرجل الرياضي المليء بالنشاط. انتعاش حمضي خالص يعطيك دفعة من الحيوية طوال اليوم.',
    price: 360,
    originalPrice: 450,
    rating: 4.7,
    reviewsCount: 110,
    isBestSeller: false,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 360, originalPrice: 450 },
      { size: '100 مل', price: 590, originalPrice: 720 }
    ],
    sillage: 4.8,
    longevity: 5,
    fragranceNotes: {
      top: ['الليمون المنعش', 'البرغموت الإيطالي'],
      heart: ['الميرمية العطرية', 'الجلبانوم'],
      base: ['خشب الأرز', 'طحلب السنديان']
    },
    suitableFor: ['جيم ورياضة', 'استخدام يومي', 'صيف وحر'],
    season: 'صيف وربيع',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'ameerat-al-arab',
    name: 'أميرة العرب | Ameerat Al Arab',
    tagline: 'شرقي أنثوي فاخر برقة الأزهار والمسك والعنبر ',
    description: 'عطر شرقي أنثوي فاخر، بيجمع بين رقة الأزهار البيضاء وحلاوة الفواكه الاستوائية مع لمسة دافئة من المسك والعنبر. بيدي إحساس بالفخامة، النظافة، والأنوثة الشرقية الراقية. مناسب للمناسبات والتجمعات، وللي بتحب العطور الفواحة اللي بتثبت وبتسيب أثر ساحر.',
    story: 'فخامة الأميرات والملوك. عطر نقي يعكس الحشمة والجمال العربي الخالص مع فوحان يدوم.',
    price: 390,
    originalPrice: 490,
    rating: 4.9,
    reviewsCount: 155,
    isBestSeller: true,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 390, originalPrice: 490 },
      { size: '100 مل', price: 650, originalPrice: 790 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['العنب اللذيذ', 'البرتقال', 'التفاح'],
      heart: ['الورد الأبيض', 'الياسمين', 'الغاردينيا', 'الإيلنغ'],
      base: ['المسك الأبيض المعتق', 'خشب الصندل', 'العنبر الدافئ']
    },
    suitableFor: ['مناسبات وتجمعات', 'عرايس', 'أفراح'],
    season: 'كل الفصول',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'love-heavenly',
    name: 'لاف هافنلي | Love Heavenly',
    tagline: 'رقيق ورومانسي بنظافة الأزهار البيضاء وخشب الصندل ',
    description: 'عطر أنثوي رقيق ورومانسي جداً، بيجمع بين نفحات الأزهار البيضاء الشفافة والفاكهة الناعمة مع لمسة دافئة وخفيفة من المسك وخشب الصندل. بيدي إحساس بالنظافة، الأناقة الهادية، والجاذبية الناعمة. ممتاز جداً للاستخدام اليومي، العرايس، والأوقات الخاصة للي بتحب العطور الرقيقة والناعمة.',
    story: 'سحر فيكتوريا سيكريت الأكثر مبيعاً ونعومة. عطر يشعرك بالانتعاش والنظافة وكأنك خارجة من دش ملكي دافئ.',
    price: 400,
    originalPrice: 500,
    rating: 4.9,
    reviewsCount: 138,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 400, originalPrice: 500 },
      { size: '100 مل', price: 660, originalPrice: 800 }
    ],
    sillage: 4.8,
    longevity: 5,
    fragranceNotes: {
      top: ['السفرجل', 'الهيل', 'أوراق الماندرين'],
      heart: ['اللوتس الأبيض', 'الفاوانيا', 'الفريزيا'],
      base: ['المسك الأبيض', 'خشب الصندل', 'الفانيليا البوربون']
    },
    suitableFor: ['استخدام يومي', 'عرايس', 'أوقات خاصة'],
    season: 'كل الفصول وربيع/صيف',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'imagination',
    name: 'إيماجينشن | Imagination (Louis Vuitton)',
    tagline: 'أيقونة الانتعاش والفخامة الصيفية بالشاي الأسود والحمضيات ',
    description: 'أيقونة الانتعاش والفخامة الصيفية. بيجمع بين حيوية الحمضيات الفاخرة (البرغموت والبرتقال) مع لمسة فريدة ورائقة من الشاي الأسود والتوابل الدافئة وخشب الأرز. بيدي إحساس بالنظافة الراقية، الانتعاش الملكي، والثقة بالنفس. عطر فواح جداً ومثالي للصيف، الشغل، والمناسبات للرجل اللي يدور على التميز والأناقة العصريّة.',
    story: 'تحفة لويس فيتون التي أذهلت عشاق العطور حول العالم. ميكس غير مسبوق بين الانتعاش الحمضي الفاخر والشاي الأسود الصيني النادر.',
    price: 490,
    originalPrice: 620,
    rating: 5.0,
    reviewsCount: 215,
    isBestSeller: true,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 490, originalPrice: 620 },
      { size: '100 مل', price: 820, originalPrice: 1050 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['السيترون', 'البرغموت الكالابري', 'البرتقال الصقلي'],
      heart: ['الشاي الأسود الصيني', 'الزنجبيل النيجيري', 'القرفة السيلانية'],
      base: ['الأمبروكسان النقي', 'اللبان', 'خشب الغاياك']
    },
    suitableFor: ['صيف وشغل', 'مناسبات راقية', 'تميز عصري'],
    season: 'صيف وربيع وكل الأوقات',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'bianco-latte',
    name: 'بيانكو لاتيه | Bianco Latte',
    tagline: 'تريند الفانيليا والكراميل والعسل والحليب الدافئ ',
    description: 'العطر الأكثر تريند وطلباً لعشاق الفانيليا والروائح السكرية. مزيج دافئ ولذيذ بياخدك لعالم تاني من حلاوة الكراميل، العسل، والحليب الدافئ مع لمسة غنية من الفانيليا والمسك. عطر بيدي إحساس بالراحة، الدفء، والجاذبية، بثبات وفوحان خيالي بيسيب أثر في كل مكان. ممتاز للشتاء، السهرات، ولأي حد بيحب العطور السويت الفخمة.',
    story: 'الظاهرة العطرية التي كسرت الإنترنت! تجربة استثنائية من الدفء واللذة تسحر الحواس وتدوم لأيام.',
    price: 490,
    originalPrice: 620,
    rating: 5.0,
    reviewsCount: 280,
    isBestSeller: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 490, originalPrice: 620 },
      { size: '100 مل', price: 820, originalPrice: 1050 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['الكراميل الدافئ', 'الحليب المكثف'],
      heart: ['عسل النحل النقي', 'حبوب التونكا'],
      base: ['الفانيليا المدغشقرية الفاخرة', 'المسك الأبيض']
    },
    suitableFor: ['شتاء وسهرات', 'عشاق السويت', 'أجواء رومانسية'],
    season: 'شتاء وخريف وسهرات',
    gender: 'الاتنين',
    inStock: true
  },
  {
    id: 'coconut',
    name: 'كوكو نات | Coconut',
    tagline: 'صيفي استوائي بروعة حليب جوز الهند والفانيليا والبحر ',
    description: 'عطر صيفي استوائي بياخدك فوراً لأجواء البحر والإجازات. بيجمع بين روعة حليب جوز الهند الدافئ وحلاوة الفانيليا الناعمة مع لمسة خفيفة من الأزهار الاستوائية. بيدي إحساس بالنظافة، والانتعاش، والدفء اللطيف في نفس الوقت. ممتاز جداً للصيف، الخروجات الصباحية، واليومية للي بتحب الروائح السويت الخفيفة واللي تفتح النفس.',
    story: 'نسيم الشاطئ في زجاجة. جوز هند استوائي غني ينعش حواسك ويأخذك إلى جزر المالديف.',
    price: 370,
    originalPrice: 470,
    rating: 4.8,
    reviewsCount: 88,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 370, originalPrice: 470 },
      { size: '100 مل', price: 590, originalPrice: 740 }
    ],
    sillage: 4.8,
    longevity: 5,
    fragranceNotes: {
      top: ['حليب جوز الهند المنعش', 'البرغموت'],
      heart: ['أزهار التياري الاستوائية', 'الإيلنغ'],
      base: ['الفانيليا الناعمة', 'المسك الأبيض', 'خشب الصندل']
    },
    suitableFor: ['صيف ومصيف', 'صباحي ويومي', 'خروجات كاجوال'],
    season: 'صيف وربيع',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'versace-eros',
    name: 'فرزاتشي إيروس | Versace Eros',
    tagline: 'الجاذبية والجرأة بانتعاش النعناع والتفاح ودفء الفانيليا ',
    description: 'عطر الجاذبية والجرأة الرجالية بدون منازع. بيجمع بين انتعاش النعناع الأخضر والتفاح مع دفء الفانيليا الساحرة وخشب الأرز الرفيع. بيدي إحساس بالقوة، الحضور الطاغي، والثقة بالنفس مع ثبات وفوحان ممتاز بيسيب أثر ملفت في كل مكان. مناسب جداً للسهرات، المناسبات، والخروجات المسائية للي بيحب العطور الفواحة والجذابة.',
    story: 'رمز الحب والقوة والشغف. حضور ذكوري مهيب لا يقاوم يمنحك ثقة مطلقة أينما حللت.',
    price: 430,
    originalPrice: 530,
    rating: 4.9,
    reviewsCount: 195,
    isBestSeller: true,
    image: '/images/perfume-placeholder.jpeg',
    sizes: [
      { size: '50 مل', price: 430, originalPrice: 530 },
      { size: '100 مل', price: 720, originalPrice: 890 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['أوراق النعناع البري', 'التفاح الأخضر الكرانشي', 'الليمون الإيطالي'],
      heart: ['حبوب التونكا الفنزويلية', 'الأمبروكسان', 'زهرة إبرة الراعي'],
      base: ['فانيليا مدغشقر', 'خشب الأرز الأطلسي', 'نجيل الهند', 'طحلب البلوط']
    },
    suitableFor: ['سهرات ومناسبات', 'خروجات مسائية', 'كاريزما رجالية'],
    season: 'كل الفصول وسهرات',
    gender: 'رجالي',
    inStock: true
  },
  {
    id: 'vanilla-love',
    name: 'فانيليا لاف | Vanilla Love',
    tagline: 'أنثوي دافئ بحلاوة الفانيليا الغنية والمسك الأبيض الرقيق ',
    description: 'عطر أنثوي دافئ وجذاب بياخد العقل، بيمزج بين حلاوة الفانيليا الغنية مع لمسة ناعمة من الأزهار والمسك الأبيض. بيدي إحساس بالدفء، الأناقة، والرقة اللذيذة اللي بتدوم. ممتاز جداً للاستخدام اليومي، السهرات اللطيفة، والأجواء الباردة للي بتحب العطور السويت الناعمة.',
    story: 'عناق دافئ من الفانيليا والسكر الناعم. عطر يفيض رقة ويدوم طويلاً بهدوء ساحر.',
    price: 390,
    originalPrice: 490,
    rating: 4.9,
    reviewsCount: 120,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 390, originalPrice: 490 },
      { size: '100 مل', price: 650, originalPrice: 790 }
    ],
    sillage: 4.9,
    longevity: 5,
    fragranceNotes: {
      top: ['زهر الفانيليا', 'السكر البني'],
      heart: ['أزهار بيضاء ناعمة', 'اللوز الحلو'],
      base: ['الفانيليا النقية', 'المسك الأبيض', 'خشب العنبر']
    },
    suitableFor: ['استخدام يومي', 'سهرات هادئة', 'أجواء باردة'],
    season: 'خريف وشتاء وكل الأوقات',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'pink-sugar',
    name: 'بينك شوجر | Pink Sugar',
    tagline: 'غزل البنات والكراميل والتوت بأنوثة شقية ومبهجة ',
    description: 'العطر الأيقوني لعشاق الروائح السويت والجذابة. بيجمع بين حلاوة غزل البنات، الكراميل الفاخر، والتوت مع لمسة دافئة من الفانيليا والمسك. بيدي إحساس بالبهجة، الدفء، والأنوثة الشقية. مناسب جداً للصبايا والبنات، الخروجات اليومية، ولأي حد بيحب العطور السكرية اللي بتلفت الانتباه وبتسيب أثر حلو ومبهج.',
    story: 'عطر الطفولة والبهجة التي تأسر القلوب. حلاوة لا تنتهي تمنحك إحساساً بالفرح طوال اليوم.',
    price: 370,
    originalPrice: 470,
    rating: 4.8,
    reviewsCount: 145,
    isBestSeller: false,
    image: '/images/perfume-placeholde-women.jpeg',
    sizes: [
      { size: '50 مل', price: 370, originalPrice: 470 },
      { size: '100 مل', price: 590, originalPrice: 740 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['غزل البنات', 'التوت البري', 'البرغموت', 'أوراق التين'],
      heart: ['حلوى الكراميل', 'الفراولة', 'عرق السوس', 'زنبق الوادي'],
      base: ['الفانيليا', 'حبوب التونكا', 'المسك', 'خشب الصندل']
    },
    suitableFor: ['بنات وشبابي', 'خروج يومي', 'أجواء مرحة'],
    season: 'كل الفصول وشتاء',
    gender: 'حريمي',
    inStock: true
  },
  {
    id: 'megamare',
    name: 'ميجامار | Megamare (Orto Parisi)',
    tagline: 'أسطورة العطور البحرية.. ثبات وفوحان خيالي يتحدى أي عطر ',
    description: 'أسطورة العطور البحرية وأحد أذكى وأقوى العطور في العالم. بياخدك لمغامرة في أعمق أسرار المحيط، مزيج ساحر بيجمع بين ثورة الأملاح البحرية مع لمسة مائية منعشة ودافئة في نفس الوقت من العنبر والأخشاب النادرة. عطر بيتميز بثبات وفوحان خيالي يتحدى أي عطر تاني، وبيدي صاحب الشغل إحساس بالقوة، الانفراد، والغموض اللي بيلفت الانتباه من على بعد مسافات. مناسب جداً للي يدور على عطر بيبصم في المكان ومابيتنساش.',
    story: 'ثورة المحيط الهادر في زجاجة. أقوى ثبات وفوحان عرفه عالم العطور، عطر يملأ المكان لساعات ويبقى في الأقمشة لأسابيع.',
    price: 490,
    originalPrice: 650,
    rating: 5.0,
    reviewsCount: 340,
    isBestSeller: true,
    isFeatured: true,
    image: '/images/perfume-womenandmen.jpeg',
    sizes: [
      { size: '50 مل', price: 490, originalPrice: 650 },
      { size: '100 مل', price: 850, originalPrice: 1100 }
    ],
    sillage: 5,
    longevity: 5,
    fragranceNotes: {
      top: ['الأملاح البحرية النقية', 'البرغموت المنعش', 'النوتات المائية العميقة'],
      heart: ['أعشاب البحر المحيطية', 'طحالب المحيط', 'الهيديون'],
      base: ['العنبر الرمادي الحوتي', 'المسك الأسطوري', 'خشب الأرز المعتق']
    },
    suitableFor: ['حضور قوي ومبهر', 'سهرات ومناسبات', 'كل الأوقات'],
    season: 'كل الفصول والصيف',
    gender: 'الاتنين',
    inStock: true
  }
];

export const EGYPT_GOVERNORATES: ShippingZone[] = [
  { governorate: 'القاهرة', cost: 40, estimatedDelivery: '24 إلى 48 ساعة' },
  { governorate: 'الجيزة', cost: 40, estimatedDelivery: '24 إلى 48 ساعة' },
  { governorate: 'الإسكندرية', cost: 45, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'القليوبية', cost: 45, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'الشرقية', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'الدقهلية (المنصورة)', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'الغربية (طنطا)', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'المنوفية', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'البحيرة', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'دمياط', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'كفر الشيخ', cost: 55, estimatedDelivery: '2 إلى 4 أيام' },
  { governorate: 'بورسعيد', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'الإسماعيلية', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'السويس', cost: 50, estimatedDelivery: '2 إلى 3 أيام' },
  { governorate: 'الفيوم', cost: 60, estimatedDelivery: '3 إلى 4 أيام' },
  { governorate: 'بني سويف', cost: 60, estimatedDelivery: '3 إلى 4 أيام' },
  { governorate: 'المنيا', cost: 65, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'أسيوط', cost: 65, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'سوهاج', cost: 70, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'قنا', cost: 75, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'الأقصر', cost: 75, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'أسوان', cost: 80, estimatedDelivery: '4 إلى 6 أيام' },
  { governorate: 'البحر الأحمر (الغردقة)', cost: 80, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'جنوب سيناء (شرم الشيخ)', cost: 85, estimatedDelivery: '3 إلى 5 أيام' },
  { governorate: 'مطروح والساحل الشمالي', cost: 85, estimatedDelivery: '3 إلى 5 أيام' }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'HEBA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 400,
    isActive: true
  },
  {
    code: 'ELHAYBA',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 500,
    isActive: true
  },
  {
    code: 'FREE',
    discountType: 'fixed',
    discountValue: 45,
    minOrderValue: 600,
    isActive: true
  }
];

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  cashPhone: '01003508854',
  secondaryCashPhone: '',
  instapayPhone: '01003508854',
  instapayUsername: '01003508854@instapay',
  accountHolderName: 'هَيْبَة للعطور',
  transferInstructions: 'يرجى إرسال لقطة شاشة (سكرين شوت) للتحويل على الواتساب 01003508854 لتأكيد الأوردر فوراً.',
  updatedAt: new Date().toISOString()
};

