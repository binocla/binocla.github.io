/* Public resume content. Every career claim comes from the supplied CV,
   updated 8 October 2026. Dates are kept explicit rather than auto-inflated. */
'use strict';
const bilingual = (ru, en) => ({ ru, en });
const resume = {
  jobs: [
    { id: 'sber', company: bilingual('Сбер', 'Sber'), period: bilingual('Май 2026 — настоящее время', 'May 2026 — present'), role: bilingual('Руководитель группы разработки', 'Java Team Lead'), domain: bilingual('Финтех', 'Fintech'), current: true,
      summary: bilingual('Техническое лидерство в Java-разработке.', 'Technical leadership in Java development.'),
      bullets: [bilingual('Текущая роль — Java Team Lead в Сбере.', 'Currently working as a Java Team Lead at Sber.')], tech: ['Java'] },
    { id: 'lanit', company: bilingual('ЛАНИТ', 'LANIT'), period: bilingual('Октябрь 2024 — май 2026', 'Oct 2024 — May 2026'), role: bilingual('Senior Java-разработчик', 'Senior Java Developer'), domain: bilingual('Риск-менеджмент · Сбер', 'Risk management · Sber'),
      summary: bilingual('Backend системы риск-менеджмента Сбербанка: архитектура, интеграции и развитие команды.', 'Backend services for Sber’s risk-management system: architecture, integrations and team development.'),
      bullets: [
        bilingual('Спроектировал и реализовал 2 BFF-микросервиса для нескольких frontend-команд.', 'Designed and implemented 2 BFF microservices serving multiple frontend teams.'),
        bilingual('Создал общую библиотеку deep health checks, используемую сервисами разных команд.', 'Built a shared deep health-check library adopted by microservices across teams.'),
        bilingual('Проектировал микросервисы с DDD и гексагональной архитектурой; документировал интеграции, Security Quality Gate и Java-конвенции.', 'Designed microservices using DDD and hexagonal architecture; documented integrations, Security Quality Gate and Java conventions.'),
        bilingual('Оптимизировал SQL: индексация и устранение N+1; улучшал многопоточный код с ExecutorService и ThreadPool в рамках нагрузочного тестирования.', 'Optimized SQL through indexing and N+1 fixes, and improved ExecutorService / thread-pool code during load testing.'),
        bilingual('Настроил аудит с гарантированной доставкой. Рефакторинг ряда сервисов сократил объём кода на 30%.', 'Configured audit delivery guarantees. Refactoring reduced code volume by 30% in selected services.'),
        bilingual('Наставлял двух Junior-разработчиков до уровня Middle и выстраивал backend-процессы в роли техлида команды.', 'Mentored two Junior developers to Middle level and established backend development processes as the team’s technical lead.'),
        bilingual('Выступил с докладом о Quarkus на конференции ЛАНИТ Би Пи Эм и писал статьи для внутреннего университета.', 'Presented a Quarkus talk at a LANIT BPM conference and wrote articles for the internal university.')
      ], tech: ['Java 11/17/21', 'Spring Boot', 'PostgreSQL', 'Kafka', 'OpenShift', 'Jenkins', 'Docker', 'gRPC', 'Keycloak', 'JUnit', 'Mockito', 'WireMock'] },
    { id: 'sophia', company: bilingual('Sophia Technologies', 'Sophia Technologies'), period: bilingual('Декабрь 2023 — октябрь 2024', 'Dec 2023 — Oct 2024'), role: bilingual('Software Engineer', 'Software Engineer'), domain: bilingual('Социальная платформа · Vivo', 'Social platform · Vivo'),
      summary: bilingual('Ответственность за backend и инфраструктуру мобильной социальной платформы.', 'Ownership of backend development and infrastructure for a mobile social platform.'),
      bullets: [
        bilingual('Разделил монолит на 5 микросервисов: проектировал архитектуру и sequence-диаграммы.', 'Split a monolith into 5 microservices, including architecture designs and sequence diagrams.'),
        bilingual('Перевёл систему со Spring Boot на Quarkus: производительность +40%, потребление памяти и размеры дистрибутивов −70%.', 'Migrated from Spring Boot to Quarkus: performance +40%, memory consumption and distribution sizes −70%.'),
        bilingual('Реализовал реактивный цикл от сервиса до клиента базы данных с Mutiny; настроил Redis-кэширование через AWS ElastiCache.', 'Implemented reactive flows from service to database client using Mutiny; configured Redis caching with AWS ElastiCache.'),
        bilingual('Разработал Helm-чарты, настраивал Kubernetes, Knative и Istio, а также окружение AWS: EC2, Lambda, Route 53, CDN и базы данных.', 'Created Helm charts and configured Kubernetes, Knative and Istio, along with AWS infrastructure: EC2, Lambda, Route 53, CDN and databases.')
      ], tech: ['Java 21', 'Quarkus', 'PostgreSQL', 'Redis', 'Mutiny', 'Kubernetes', 'Helm', 'AWS', 'Docker', 'REST', 'WebSocket', 'RestAssured'] },
    { id: 'tourmachine', company: bilingual('Турмашина', 'Tourmachine'), period: bilingual('Июнь 2023 — ноябрь 2023', 'Jun 2023 — Nov 2023'), role: bilingual('Java-разработчик', 'Java Developer'), domain: bilingual('TravelTech · РЖД / davay.travel', 'TravelTech · RZD / davay.travel'),
      summary: bilingual('Сервисы бронирования и интеграции для цифровых туристических продуктов.', 'Booking services and integrations for digital travel products.'),
      bullets: [
        bilingual('С нуля разработал сервис бронирования билетов на мероприятия для travel.rzd.ru и новый сервис бронирования авиабилетов для конструктора путешествий.', 'Built an event-ticket booking service for travel.rzd.ru from scratch and a new flight-booking service for a travel planner.'),
        bilingual('Интегрировал микросервисы с RabbitMQ, Redis, Kassir и Афишей по SOAP / REST.', 'Integrated microservices with RabbitMQ, Redis, Kassir and Afisha through SOAP / REST.'),
        bilingual('Участвовал в декомпозиции и грумингах, переводил императивный код на реактивную и многопоточную модель; оптимизировал SQL и индексы.', 'Contributed to task breakdown and refinement, migrated imperative code to reactive and multithreaded flows, and optimized SQL and indexes.')
      ], tech: ['Java 11/17', 'Spring Boot', 'RabbitMQ', 'Project Reactor', 'PostgreSQL', 'MongoDB', 'Kubernetes', 'Jenkins', 'SOAP', 'WireMock'] },
    { id: 'naumen', company: bilingual('NAUMEN', 'NAUMEN'), period: bilingual('Январь 2023 — апрель 2023', 'Jan 2023 — Apr 2023'), role: bilingual('Java-разработчик', 'Java Developer'), domain: bilingual('Enterprise · Naumen SMP', 'Enterprise · Naumen SMP'),
      summary: bilingual('Разработка и сопровождение функциональности платформы Naumen SMP.', 'Feature development and maintenance for the Naumen SMP platform.'),
      bullets: [bilingual('Разрабатывал и поддерживал функциональность монолитного приложения на Jakarta EE и Spring Framework.', 'Developed and maintained features in a monolithic application using Jakarta EE and Spring Framework.')], tech: ['Jakarta EE', 'Spring Framework', 'Jenkins', 'JUnit'] },
    { id: 'orion', company: bilingual('Orion Innovation', 'Orion Innovation'), period: bilingual('Ноябрь 2021 — декабрь 2022', 'Nov 2021 — Dec 2022'), role: bilingual('Software Designer (Java)', 'Software Designer (Java)'), domain: bilingual('Биопринтинг · IoT', 'Bioprinting · IoT'),
      summary: bilingual('Greenfield-разработка в биоинженерии и развитие существующего IoT-продукта.', 'Greenfield development in bioengineering and evolution of an existing IoT product.'),
      bullets: [
        bilingual('Работал в проекте биопринтинга с командой до 20 человек и IoT-проекте с командой до 10 человек.', 'Contributed to a bioprinting project in a team of up to 20 and an IoT project in a team of up to 10.'),
        bilingual('Разрабатывал RESTful, GraphQL и WebSocket-интеграции, включая mTLS; применял микросервисы, serverless, GraalVM и реактивное программирование.', 'Developed RESTful, GraphQL and WebSocket integrations, including mTLS; worked with microservices, serverless, GraalVM and reactive programming.'),
        bilingual('Работал с контейнерами, Helm, Tekton CI/CD, Google Cloud Platform и AWS.', 'Worked with containers, Helm, Tekton CI/CD, Google Cloud Platform and AWS.')
      ], tech: ['Java', 'GraalVM', 'Project Reactor', 'Mutiny', 'GraphQL', 'Docker', 'Helm', 'Tekton', 'GCP', 'AWS'] }
  ],
  cases: [
    { id: 'performance', metric: '+40% / −70%', label: bilingual('производительность / память и сборки', 'performance / memory & size'), title: bilingual('Миграция на Quarkus', 'Migration to Quarkus'), source: 'Sophia Technologies · 2023–2024', number: '01',
      intro: bilingual('Перевёл backend социальной платформы Vivo со Spring Boot на Quarkus и разделил монолит на 5 микросервисов.', 'Migrated the backend of the Vivo social platform from Spring Boot to Quarkus and split the monolith into 5 microservices.'),
      work: bilingual('Проектировал сервисы и взаимодействия, реализовывал реактивные потоки до базы данных, готовил Helm-чарты и окружение AWS.', 'Designed services and interactions, implemented reactive flows through to the database, and prepared Helm charts and AWS infrastructure.'),
      result: bilingual('Производительность системы выросла на 40%. Потребление памяти и размеры дистрибутивов снизились на 70%.', 'System performance increased by 40%. Memory consumption and distribution sizes decreased by 70%.'), tech: ['Quarkus', 'Java 21', 'Mutiny', 'AWS', 'Kubernetes'] },
    { id: 'bff', metric: '2', label: bilingual('BFF-микросервиса', 'BFF microservices'), title: bilingual('BFF для риск-менеджмента', 'Risk-management BFFs'), source: bilingual('ЛАНИТ · 2024–2026', 'LANIT · 2024–2026'), number: '03',
      intro: bilingual('В системе риск-менеджмента Сбербанка нескольким frontend-командам требовались BFF-сервисы.', 'Multiple frontend teams needed BFF services for Sber’s risk-management system.'),
      work: bilingual('Спроектировал и реализовал два BFF-микросервиса. Разработал общую библиотеку deep health checks и документировал интеграции и соглашения для разработчиков.', 'Designed and implemented two BFF microservices. Created a shared deep health-check library and documented integrations and developer conventions.'),
      result: bilingual('Оба BFF использовались несколькими frontend-командами. Библиотека health checks применялась в микросервисах разных команд.', 'Both BFFs served multiple frontend teams. The health-check library was used by microservices across teams.'), tech: ['Java', 'Spring Boot', 'PostgreSQL', 'REST', 'gRPC'] },
    { id: 'mentoring', metric: '2', label: bilingual('разработчика · Junior → Middle', 'developers · Junior → Middle'), title: bilingual('Менторство', 'Mentoring'), source: bilingual('ЛАНИТ · 2024–2026', 'LANIT · 2024–2026'), number: '04',
      intro: bilingual('Помимо backend-разработки, занимался наставничеством и выстраивал процессы разработки в команде.', 'Alongside backend development, mentored developers and established team development processes.'),
      work: bilingual('Наставлял двух Junior-разработчиков, писал Java Code Style и Code Conventions, технические статьи и выступал с докладом о Quarkus.', 'Mentored two Junior developers, wrote Java style and code conventions, authored technical articles and delivered a Quarkus talk.'),
      result: bilingual('Два разработчика выросли до уровня Middle. Технические знания были оформлены в соглашения и материалы для команды и внутреннего университета.', 'Two developers progressed to Middle level. Technical knowledge was captured in team conventions and internal university materials.'), tech: ['Mentoring', 'Code review', 'Java', 'Quarkus'] }
  ],
  stack: [
    { id: 'backend', label: bilingual('Backend', 'Backend'), icon: '{ }', title: bilingual('Сервисы и архитектура', 'Services & architecture'), description: bilingual('BFF, микросервисы, DDD и гексагональная архитектура. Реактивные потоки от API до базы данных.', 'BFFs, microservices, DDD and hexagonal architecture. Reactive flows from API to database.'), tech: ['Java', 'Quarkus', 'Spring Boot', 'Jakarta EE', 'Hibernate / JPA', 'Mutiny', 'Project Reactor', 'REST', 'gRPC', 'GraphQL', 'WebSocket'], context: bilingual('ЛАНИТ · Sophia Technologies · Orion', 'LANIT · Sophia Technologies · Orion') },
    { id: 'data', label: bilingual('Данные и события', 'Data & events'), icon: '≋', title: bilingual('Данные и интеграции', 'Data & integrations'), description: bilingual('Оптимизация SQL и устранение N+1, индексация, кэширование, событийные интеграции и гарантированная доставка аудита.', 'SQL optimization, N+1 fixes, indexing, caching, event-driven integrations and audit delivery guarantees.'), tech: ['PostgreSQL', 'Kafka', 'Redis', 'RabbitMQ', 'MongoDB', 'MinIO', 'SOAP'], context: bilingual('ЛАНИТ · Sophia Technologies · Турмашина', 'LANIT · Sophia Technologies · Tourmachine') },
    { id: 'platform', label: bilingual('Платформа', 'Platform'), icon: '⌘', title: bilingual('Инфраструктура и доставка', 'Infrastructure & delivery'), description: bilingual('Контейнеризация, Helm-чарты, оркестрация и CI/CD. Настройка облачного окружения и Redis-кэша в AWS.', 'Containers, Helm charts, orchestration and CI/CD. Cloud infrastructure setup and Redis caching on AWS.'), tech: ['Kubernetes', 'Docker', 'OpenShift', 'Helm', 'AWS', 'GCP', 'Jenkins', 'Tekton', 'Knative', 'Istio', 'Maven', 'Gradle'], context: bilingual('Sophia Technologies · ЛАНИТ · Orion', 'Sophia Technologies · LANIT · Orion') },
    { id: 'quality', label: bilingual('Качество', 'Quality'), icon: '✓', title: bilingual('Качество и наблюдаемость', 'Quality & observability'), description: bilingual('Тестирование сервисов и интеграций, deep health checks, нагрузочная оптимизация и технические соглашения команды.', 'Service and integration testing, deep health checks, load-test optimization and team engineering conventions.'), tech: ['JUnit', 'Mockito', 'WireMock', 'RestAssured', 'OpenAPI', 'Keycloak', 'Security Quality Gate'], context: bilingual('ЛАНИТ · Sophia Technologies · Турмашина', 'LANIT · Sophia Technologies · Tourmachine') }
  ],
  education: [
    { year: '2024', name: bilingual('Саратовский государственный университет', 'Saratov State University'), faculty: bilingual('Факультет компьютерных наук и информационных технологий · программная инженерия', 'Faculty of Computer Science and Information Technology · Software Engineering') },
    { year: '2022', name: bilingual('Казанский федеральный университет', 'Kazan Federal University'), faculty: bilingual('Высшая школа ИТ и интеллектуальных систем · программная инженерия', 'Higher Institute of IT and Intelligent Systems · Software Engineering') }
  ]
};
const translations = {
  ru: {
    skip: 'К содержимому', name: 'Сергей Шамов', navigation: 'Навигация',
    navImpact: 'Результаты', navExperience: 'Опыт', navStack: 'Стек', navContact: 'Контакты',
    heroCompany: 'Сбер', heroDescription: 'Java backend, распределённые системы и микросервисы.',
    explore: 'Опыт ↓', location: 'Москва · удалённо', profileSummary: 'Кратко',
    sinceLabel: 'В разработке', sinceValue: 'с 2021 года', focusLabel: 'Специализация',
    impactTitle: 'Результаты', caseMore: 'Подробнее', context: 'Контекст', work: 'Что сделал', result: 'Результат',
    experienceTitle: 'Опыт работы', current: 'Сейчас', details: 'Подробнее',
    stackTitle: 'Стек', all: 'Все', stackFilter: 'Направления технологий',
    backgroundTitle: 'Образование и языки', education: 'Образование', incomplete: 'Неоконченное высшее',
    langTitle: 'Языки', russian: 'Русский', native: 'Родной', english: 'Английский', advanced: 'C1 · Продвинутый',
    contactTitle: 'Контакты', share: 'Скопировать ссылку', print: 'Сохранить в PDF',
    copied: 'Ссылка на русскую версию скопирована', copyFailed: 'Не удалось скопировать. Скопируйте адрес из строки браузера.',
    printHint: 'Выберите «Сохранить как PDF» в окне печати', updated: 'Октябрь 2026', backTop: 'Наверх ↑',
    close: 'Закрыть', dark: 'Тёмная тема', light: 'Светлая тема',
    meta: 'Сергей Шамов — Java Team Lead в Сбере. Java, Quarkus, Spring Boot, Kafka, PostgreSQL, Kubernetes.'
  },
  en: {
    skip: 'Skip to content', name: 'Sergey Shamov', navigation: 'Navigation',
    navImpact: 'Results', navExperience: 'Experience', navStack: 'Stack', navContact: 'Contact',
    heroCompany: 'Sber', heroDescription: 'Java backend, distributed systems and microservices.',
    explore: 'Experience ↓', location: 'Moscow · remote', profileSummary: 'At a glance',
    sinceLabel: 'In development', sinceValue: 'since 2021', focusLabel: 'Focus',
    impactTitle: 'Selected results', caseMore: 'Details', context: 'Context', work: 'My contribution', result: 'Outcome',
    experienceTitle: 'Experience', current: 'Current', details: 'Details',
    stackTitle: 'Stack', all: 'All', stackFilter: 'Technology areas',
    backgroundTitle: 'Education & languages', education: 'Education', incomplete: 'Undergraduate studies · incomplete',
    langTitle: 'Languages', russian: 'Russian', native: 'Native', english: 'English', advanced: 'C1 · Advanced',
    contactTitle: 'Contact', share: 'Copy profile link', print: 'Save as PDF',
    copied: 'Link to the English version copied', copyFailed: 'Could not copy. Please copy the address from your browser.',
    printHint: 'Choose “Save as PDF” in the print dialog', updated: 'October 2026', backTop: 'Back to top ↑',
    close: 'Close', dark: 'Dark theme', light: 'Light theme',
    meta: 'Sergey Shamov — Java Team Lead at Sber. Java, Quarkus, Spring Boot, Kafka, PostgreSQL, Kubernetes.'
  }
};
