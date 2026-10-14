import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  Users,
  Briefcase,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  MessageSquare,
  Building2,
  Plane,
  FileText
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import { trackQuoteConversion } from '../lib/googleAds';
import styles from './ReservationSuccessPage.module.css';

const TEXTS = {
  fr: {
    badge: 'Demande de devis transmise',
    title: 'Votre demande a bien été transmise',
    subtitle: 'Nous vous remercions de votre confiance. Notre équipe étudie votre demande et vous transmet votre devis officiel sous 15 minutes.',
    refLabel: 'Référence du dossier',
    copyRef: 'Copier',
    copied: 'Copié !',
    serviceLabel: 'Prestation',
    vehicleLabel: 'Véhicule',
    itineraryLabel: 'Itinéraire & Horaires',
    pickupLabel: 'Prise en charge',
    dropoffLabel: 'Destination',
    dateTimeLabel: 'Date & Heure',
    flightLabel: 'Numéro de vol / train',
    durationLabel: 'Durée de mise à disposition',
    clientLabel: 'Vos coordonnées',
    fullNameLabel: 'Nom complet',
    driverInstructionsLabel: 'Consignes chauffeur',
    hoursLabel: 'heures',
    atLabel: 'à',
    passengersLabel: 'passagers',
    luggageLabel: 'bagages',
    defaultServiceTransfer: 'Transfert Point A à Point B',
    defaultServiceHourly: 'Mise à disposition avec chauffeur',
    defaultServiceBespoke: 'Demande Sur-Mesure & Événements',
    phoneLabel: 'Téléphone',
    emailLabel: 'Email',
    companyLabel: 'Société',
    notesLabel: 'Précisions & Instructions',
    bespokeLabel: 'Demande personnalisée',
    priceEstimate: 'Tarification',
    priceNotice: 'Devis officiel transmis sous 15 min',
    stepsTitle: 'Prochaines étapes de votre réservation',
    step1Title: '1. Étude de votre itinéraire (< 15 min)',
    step1Desc: 'Notre équipe vérifie les disponibilités et valide le tarif garanti tout inclus, sans surprise.',
    step2Title: '2. Envoi de votre devis officiel',
    step2Desc: 'Vous recevez votre confirmation complète par email et SMS, avec les coordonnées de votre chauffeur dédié.',
    step3Title: '3. Accueil & Prise en charge le jour J',
    step3Desc: 'Votre chauffeur vous attend à l’heure convenue avec pancarte nominative et prise en charge attentionnée de vos bagages.',
    whatsappBtn: 'Échanger directement sur WhatsApp',
    whatsappSub: 'Réponse rapide par notre équipe opérationnelle',
    phoneBtn: 'Permanence téléphonique : +33 1 84 80 56 76',
    printBtn: 'Imprimer / Sauvegarder',
    backHome: 'Retourner à l’accueil SELY',
  },
  en: {
    badge: 'Official Quote Request Confirmed',
    title: 'Your quote request has been confirmed',
    subtitle: 'Thank you for choosing SELY Privé. Our dispatch management is reviewing your itinerary and will send your confirmed quote within 15 minutes.',
    refLabel: 'Booking reference',
    copyRef: 'Copy reference',
    copied: 'Copied!',
    serviceLabel: 'Service',
    vehicleLabel: 'Vehicle',
    itineraryLabel: 'Itinerary & Schedule',
    pickupLabel: 'Pick-up location',
    dropoffLabel: 'Destination / Area',
    dateTimeLabel: 'Date & Time',
    flightLabel: 'Flight / Train number',
    durationLabel: 'Disposal duration',
    clientLabel: 'Passenger & Contact',
    fullNameLabel: 'Full name',
    driverInstructionsLabel: 'Chauffeur instructions',
    hoursLabel: 'hours',
    atLabel: 'at',
    passengersLabel: 'passengers',
    luggageLabel: 'bags',
    defaultServiceTransfer: 'Point A to Point B Transfer',
    defaultServiceHourly: 'Dedicated Chauffeur Disposal',
    defaultServiceBespoke: 'Bespoke Program & Events',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    companyLabel: 'Company',
    notesLabel: 'Special requests & Notes',
    bespokeLabel: 'Mobility program',
    priceEstimate: 'Estimated rate',
    priceNotice: 'Official binding quote sent within 15 min',
    stepsTitle: 'SELY Privé Operational Protocol',
    step1Title: '1. Immediate Operational Review (< 15 min)',
    step1Desc: 'Real-time routing assessment, VIP access verification, and calculation of guaranteed all-inclusive executive pricing.',
    step2Title: '2. Official Quote & Chauffeur Assignment',
    step2Desc: 'Receive your complete summary by email and SMS, including direct confirmation link and assigned chauffeur contact.',
    step3Title: '3. Executive Meet & Greet Service',
    step3Desc: 'Live flight monitoring (complimentary wait time for delays), personalized name-board meet & greet, and full luggage assistance.',
    whatsappBtn: 'Instant Priority Confirmation on WhatsApp',
    whatsappSub: 'Direct live communication with our Parisian dispatch desk',
    phoneBtn: '24/7 VIP Hotline: +33 1 84 80 56 76',
    printBtn: 'Print / Save Confirmation',
    backHome: 'Return to Homepage',
  },
  es: {
    badge: 'Solicitud de Presupuesto Confirmada',
    title: 'Su solicitud de presupuesto ha sido confirmada',
    subtitle: 'Agradecemos su confianza en SELY Privé. Nuestro equipo de operaciones revisa su itinerario y le enviará su presupuesto oficial en menos de 15 minutos.',
    refLabel: 'Referencia del servicio',
    copyRef: 'Copiar referencia',
    copied: '¡Copiado!',
    serviceLabel: 'Servicio',
    vehicleLabel: 'Vehículo',
    itineraryLabel: 'Itinerario y Horarios',
    pickupLabel: 'Lugar de recogida',
    dropoffLabel: 'Destino',
    dateTimeLabel: 'Fecha y Hora',
    flightLabel: 'Número de vuelo / tren',
    durationLabel: 'Duración del servicio',
    clientLabel: 'Datos de contacto',
    fullNameLabel: 'Nombre completo',
    driverInstructionsLabel: 'Instrucciones al chófer',
    hoursLabel: 'horas',
    atLabel: 'a las',
    passengersLabel: 'pasajeros',
    luggageLabel: 'maletas',
    defaultServiceTransfer: 'Traslado Punto A a Punto B',
    defaultServiceHourly: 'Chófer privado a disposición',
    defaultServiceBespoke: 'Solicitud a medida y eventos',
    phoneLabel: 'Teléfono',
    emailLabel: 'Email',
    companyLabel: 'Empresa',
    notesLabel: 'Instrucciones y Notas',
    bespokeLabel: 'Programa de viaje',
    priceEstimate: 'Tarifa estimada',
    priceNotice: 'Presupuesto vinculante oficial enviado en 15 min',
    stepsTitle: 'Protocolo Operativo SELY Privé',
    step1Title: '1. Revisión de ruta inmediata (< 15 min)',
    step1Desc: 'Evaluación de trayecto, verificación de accesos VIP y confirmación de tarifa ejecutiva con todo incluido garantizado.',
    step2Title: '2. Presupuesto oficial y asignación de chófer',
    step2Desc: 'Reciba el itinerario completo por email y SMS con enlace de confirmación directa y datos de su chófer.',
    step3Title: '3. Recepción VIP y bienvenida personalizada',
    step3Desc: 'Seguimiento de vuelo en tiempo real, bienvenida con cartel con su nombre y asistencia completa de equipaje.',
    whatsappBtn: 'Confirmación prioritaria por WhatsApp',
    whatsappSub: 'Comunicación en directo con nuestra oficina de operaciones en París',
    phoneBtn: 'Línea VIP 24/7: +33 1 84 80 56 76',
    printBtn: 'Imprimir / Guardar confirmación',
    backHome: 'Volver al Inicio',
  },
  ar: {
    badge: 'تم تأكيد طلب عرض السعر الرسمي',
    title: 'تم إرسال طلبكم بنجاح',
    subtitle: 'نشكركم على اختياركم SELY Privé. يراجع فريق العمليات مساركم وسيرسل عرض السعر الرسمي المؤكد خلال 15 دقيقة.',
    refLabel: 'الرقم المرجعي للحجز',
    copyRef: 'نسخ الرقم المرجعي',
    copied: 'تم النسخ!',
    serviceLabel: 'نوع الخدمة',
    vehicleLabel: 'المركبة',
    itineraryLabel: 'المسار والمواعيد',
    pickupLabel: 'مكان الانطلاق',
    dropoffLabel: 'الوجهة / المنطقة',
    dateTimeLabel: 'التاريخ والوقت',
    flightLabel: 'رقم الرحلة / القطار',
    durationLabel: 'مدة الإتاحة بالساعات',
    clientLabel: 'بيانات الراكب والاتصال',
    fullNameLabel: 'الاسم الكامل',
    driverInstructionsLabel: 'تعليمات خاصة للسائق',
    hoursLabel: 'ساعات',
    atLabel: 'الساعة',
    passengersLabel: 'ركاب',
    luggageLabel: 'حقائب',
    defaultServiceTransfer: 'توصيل خاص من نقطة إلى نقطة',
    defaultServiceHourly: 'سائق خاص متاح بالساعة',
    defaultServiceBespoke: 'برنامج مخصص وفعاليات كبرى',
    phoneLabel: 'الهاتف',
    emailLabel: 'البريد الإلكتروني',
    companyLabel: 'الشركة / المؤسسة',
    notesLabel: 'الملاحظات والطلبات الخاصة',
    bespokeLabel: 'برنامج التنقل المخصص',
    priceEstimate: 'التسعير التقديري',
    priceNotice: 'عرض السعر الرسمي الملزم يُرسل خلال 15 دقيقة',
    stepsTitle: 'بروتوكول عمليات SELY Privé التنفيذي',
    step1Title: '1. مراجعة تشغيلية فورية (< 15 دقيقة)',
    step1Desc: 'تقييم المسار وتصاريح المرور الخاصة واحتساب تسعير شامل لكل شيء دون أي مفاجآت.',
    step2Title: '2. إرسال عرض السعر وتعيين السائق المخصص',
    step2Desc: 'استلام الملخص الرسمي عبر البريد والرسائل النصية مع وسيلة الاتصال المباشرة بسائقكم.',
    step3Title: '3. استقبال وترحيب ملكي يوم الرحلة',
    step3Desc: 'متابعة حية للرحلات الجوية مع انتظار مجاني عند التأخير، ولافتة اسمية واستقبال راقٍ للأمتعة.',
    whatsappBtn: 'تأكيد فوري ذو أولوية عبر واتساب',
    whatsappSub: 'تواصل مباشر مع مكتب العمليات في باريس',
    phoneBtn: 'الخط الساخن لكبار الشخصيات 24/7: +33 1 84 80 56 76',
    printBtn: 'طباعة / حفظ التأكيد',
    backHome: 'العودة إلى الصفحة الرئيسية',
  },
  zh: {
    badge: '官方正式询价单已确认受理',
    title: '您的专属询价需求已成功送达',
    subtitle: '衷心感谢您选择 SELY Privé。巴黎调度中心正在审核您的行程细节，将在15分钟内为您出具经确认的正式报价单。',
    refLabel: '行程预订编号',
    copyRef: '复制预订编号',
    copied: '已复制！',
    serviceLabel: '出行服务',
    vehicleLabel: '预留车辆',
    itineraryLabel: '行程路线与时间',
    pickupLabel: '出发接乘地点',
    dropoffLabel: '目的地 / 行程区域',
    dateTimeLabel: '出行日期与时间',
    flightLabel: '航班号 / 高铁车次',
    durationLabel: '包车待命时长',
    clientLabel: '贵宾与联系人',
    fullNameLabel: '贵宾姓名',
    driverInstructionsLabel: '司机随车指令',
    hoursLabel: '小时',
    atLabel: '时间',
    passengersLabel: '位乘客',
    luggageLabel: '件行李',
    defaultServiceTransfer: '点对点尊享接送服务',
    defaultServiceHourly: '专属司机按需包车待命',
    defaultServiceBespoke: '高端会展与定制出行方案',
    phoneLabel: '手机号码',
    emailLabel: '电子邮箱',
    companyLabel: '公司名称',
    notesLabel: '特殊要求与备注',
    bespokeLabel: '定制出行方案',
    priceEstimate: '预估费用',
    priceNotice: '正式报价单将在15分钟内发送',
    stepsTitle: 'SELY Privé 尊享运营保障流程',
    step1Title: '1. 快速运营调度审核（15分钟内）',
    step1Desc: '实时评估路况与通行特权，计算无任何隐形附加费用的尊享官方固定价格。',
    step2Title: '2. 发送正式报价及司机详情',
    step2Desc: '通过短信与邮件接收行程单、在线确认链接以及专属司机的直联方式。',
    step3Title: '3. 贵宾迎宾与航班实时遥测追踪',
    step3Desc: '航班动态实时追踪（延误尊享免费等候），专属姓名指示牌接机及全程行李协助。',
    whatsappBtn: '通过 WhatsApp 优先确认',
    whatsappSub: '直接与巴黎调度中心取得实时联系',
    phoneBtn: '24/7 贵宾热线: +33 1 84 80 56 76',
    printBtn: '打印 / 保存行程单',
    backHome: '返回 SELY 首页',
  },
  de: {
    badge: 'Offizielle Angebotsanfrage bestätigt',
    title: 'Ihre Anfrage wurde erfolgreich übermittelt',
    subtitle: 'Vielen Dank für Ihr Vertrauen. Unser Team prüft Ihre Route und sendet Ihnen Ihr offizielles Angebot innerhalb von 15 Minuten zu.',
    refLabel: 'Buchungsnummer',
    copyRef: 'Kopieren',
    copied: 'Kopiert!',
    serviceLabel: 'Service',
    vehicleLabel: 'Fahrzeug',
    itineraryLabel: 'Route & Zeitplan',
    pickupLabel: 'Abholort',
    dropoffLabel: 'Zielort',
    dateTimeLabel: 'Datum & Uhrzeit',
    flightLabel: 'Flug- / Zugnummer',
    durationLabel: 'Dauer der Bereitstellung',
    clientLabel: 'Ihre Kontaktdaten',
    fullNameLabel: 'Vollständiger Name',
    driverInstructionsLabel: 'Anweisungen an den Fahrer',
    hoursLabel: 'Stunden',
    atLabel: 'um',
    passengersLabel: 'Passagiere',
    luggageLabel: 'Koffer',
    defaultServiceTransfer: 'Privattransfer von A nach B',
    defaultServiceHourly: 'Chauffeurservice auf Abruf',
    defaultServiceBespoke: 'Maßgeschneidertes Event- & Reiseprogramm',
    phoneLabel: 'Telefon',
    emailLabel: 'E-Mail',
    companyLabel: 'Unternehmen',
    notesLabel: 'Hinweise & Wünsche',
    bespokeLabel: 'Individuelles Programm',
    priceEstimate: 'Tarif',
    priceNotice: 'Offizielles Festpreisangebot innerhalb von 15 Min',
    stepsTitle: 'Die nächsten Schritte Ihrer Reservierung',
    step1Title: '1. Prüfung Ihrer Route (< 15 Min)',
    step1Desc: 'Unser Team prüft die Verfügbarkeit und bestätigt den garantierten All-inclusive-Festpreis.',
    step2Title: '2. Übermittlung des offiziellen Angebots',
    step2Desc: 'Sie erhalten Ihre vollständige Bestätigung per E-Mail und SMS mit den Kontaktdaten Ihres festen Chauffeurs.',
    step3Title: '3. Persönlicher Empfang am Reisetag',
    step3Desc: 'Ihr Chauffeur erwartet Sie pünktlich mit Namensschild und kümmert sich aufmerksam um Ihr Gepäck.',
    whatsappBtn: 'Direkt über WhatsApp abstimmen',
    whatsappSub: 'Schnelle Antwort durch unsere Einsatzzentrale',
    phoneBtn: 'Telefonische Hotline: +33 1 84 80 56 76',
    printBtn: 'Drucken / Speichern',
    backHome: 'Zurück zur SELY-Startseite',
  },
  it: {
    badge: 'Richiesta di preventivo confermata',
    title: 'La tua richiesta è stata trasmessa con successo',
    subtitle: 'Ti ringraziamo per la fiducia in SELY Privé. Il nostro team esamina il tuo itinerario e ti invierà il preventivo ufficiale entro 15 minuti.',
    refLabel: 'Codice di riferimento',
    copyRef: 'Copia',
    copied: 'Copiato!',
    serviceLabel: 'Servizio',
    vehicleLabel: 'Veicolo',
    itineraryLabel: 'Itinerario e Orari',
    pickupLabel: 'Punto di partenza',
    dropoffLabel: 'Destinazione',
    dateTimeLabel: 'Data e Ora',
    flightLabel: 'Numero di volo / treno',
    durationLabel: 'Durata della disposizione',
    clientLabel: 'I tuoi dati di contatto',
    fullNameLabel: 'Nome e cognome',
    driverInstructionsLabel: 'Istruzioni per l\'autista',
    hoursLabel: 'ore',
    atLabel: 'alle',
    passengersLabel: 'passeggeri',
    luggageLabel: 'valigie',
    defaultServiceTransfer: 'Trasferimento da punto A a punto B',
    defaultServiceHourly: 'Chauffeur privato a disposizione',
    defaultServiceBespoke: 'Richiesta su misura ed eventi',
    phoneLabel: 'Telefono',
    emailLabel: 'Email',
    companyLabel: 'Azienda',
    notesLabel: 'Richieste particolari',
    bespokeLabel: 'Programma di mobilità',
    priceEstimate: 'Tariffa',
    priceNotice: 'Preventivo ufficiale inviato entro 15 min',
    stepsTitle: 'I prossimi passi della tua prenotazione',
    step1Title: '1. Studio dell\'itinerario (< 15 min)',
    step1Desc: 'Il nostro team verifica la disponibilità e calcola la tariffa fissa garantita tutto incluso.',
    step2Title: '2. Invio del preventivo ufficiale',
    step2Desc: 'Ricevi la conferma completa via email e SMS con i dettagli del tuo autista dedicato.',
    step3Title: '3. Accoglienza e servizio il giorno del viaggio',
    step3Desc: 'Il tuo autista ti attende con cartello nominativo e provvede alla gestione accurata dei tuoi bagagli.',
    whatsappBtn: 'Contattaci direttamente su WhatsApp',
    whatsappSub: 'Risposta rapida dalla nostra centrale operativa',
    phoneBtn: 'Assistenza telefonica 24/7: +33 1 84 80 56 76',
    printBtn: 'Stampa / Salva',
    backHome: 'Torna alla home page SELY',
  },
  pt: {
    badge: 'Pedido de orçamento confirmado',
    title: 'Seu pedido foi transmitido com sucesso',
    subtitle: 'Agradecemos sua confiança na SELY Privé. Nossa equipe analisa seu itinerário e enviará seu orçamento oficial em menos de 15 minutos.',
    refLabel: 'Referência da reserva',
    copyRef: 'Copiar',
    copied: 'Copiado!',
    serviceLabel: 'Serviço',
    vehicleLabel: 'Veículo',
    itineraryLabel: 'Itinerário e Horários',
    pickupLabel: 'Local de embarque',
    dropoffLabel: 'Destino',
    dateTimeLabel: 'Data e Hora',
    flightLabel: 'Número do voo / trem',
    durationLabel: 'Duração da disposição',
    clientLabel: 'Seus dados de contato',
    fullNameLabel: 'Nome completo',
    driverInstructionsLabel: 'Instruções ao motorista',
    hoursLabel: 'horas',
    atLabel: 'às',
    passengersLabel: 'passageiros',
    luggageLabel: 'malas',
    defaultServiceTransfer: 'Traslado Ponto A para Ponto B',
    defaultServiceHourly: 'Motorista particular à disposição',
    defaultServiceBespoke: 'Programa sob medida e eventos',
    phoneLabel: 'Telefone',
    emailLabel: 'E-mail',
    companyLabel: 'Empresa',
    notesLabel: 'Instruções e Observações',
    bespokeLabel: 'Programa de mobilidade',
    priceEstimate: 'Tarifação',
    priceNotice: 'Orçamento oficial enviado em 15 min',
    stepsTitle: 'Próximas etapas da sua reserva',
    step1Title: '1. Análise do itinerário (< 15 min)',
    step1Desc: 'Nossa equipe verifica a disponibilidade e valida a tarifa garantida com tudo incluído.',
    step2Title: '2. Envio do orçamento oficial',
    step2Desc: 'Você recebe sua confirmação completa por e-mail e SMS com o contato do seu motorista dedicado.',
    step3Title: '3. Recepção e atendimento no dia da viagem',
    step3Desc: 'Seu motorista o aguarda no horário combinado com placa nominal e assistência total com as bagagens.',
    whatsappBtn: 'Falar diretamente no WhatsApp',
    whatsappSub: 'Resposta rápida pela nossa central operacional',
    phoneBtn: 'Atendimento telefônico 24/7: +33 1 84 80 56 76',
    printBtn: 'Imprimir / Salvar',
    backHome: 'Voltar ao início SELY',
  },
  ru: {
    badge: 'Запрос на расчет подтвержден',
    title: 'Ваш запрос успешно отправлен',
    subtitle: 'Благодарим вас за выбор SELY Privé. Наша диспетчерская служба изучает маршрут и направит официальный расчет в течение 15 минут.',
    refLabel: 'Номер заявки',
    copyRef: 'Скопировать',
    copied: 'Скопировано!',
    serviceLabel: 'Услуга',
    vehicleLabel: 'Автомобиль',
    itineraryLabel: 'Маршрут и расписание',
    pickupLabel: 'Место подачи',
    dropoffLabel: 'Место назначения',
    dateTimeLabel: 'Дата и время',
    flightLabel: 'Номер рейса / поезда',
    durationLabel: 'Длительность аренды',
    clientLabel: 'Контактные данные',
    fullNameLabel: 'Полное имя',
    driverInstructionsLabel: 'Пожелания водителю',
    hoursLabel: 'часов',
    atLabel: 'в',
    passengersLabel: 'пассажиров',
    luggageLabel: 'чемоданов',
    defaultServiceTransfer: 'Трансфер из точки А в точку Б',
    defaultServiceHourly: 'Аренда автомобиля с личным водителем',
    defaultServiceBespoke: 'Индивидуальная программа поездки',
    phoneLabel: 'Телефон',
    emailLabel: 'Email',
    companyLabel: 'Компания',
    notesLabel: 'Особые пожелания',
    bespokeLabel: 'Индивидуальная программа',
    priceEstimate: 'Тариф',
    priceNotice: 'Официальный расчет направляется за 15 мин',
    stepsTitle: 'Следующие шаги бронирования',
    step1Title: '1. Обработка маршрута (< 15 мин)',
    step1Desc: 'Проверка доступности автомобилей и фиксация гарантированного тарифа «все включено».',
    step2Title: '2. Отправка официального расчета',
    step2Desc: 'Вы получаете подтверждение на email и по SMS с прямыми контактами назначенного водителя.',
    step3Title: '3. Встреча и трансфер в назначенный день',
    step3Desc: 'Водитель встречает вас с именной табличкой и бережно помогает с багажом.',
    whatsappBtn: 'Связаться напрямую в WhatsApp',
    whatsappSub: 'Быстрый ответ оперативной службы',
    phoneBtn: 'Круглосуточная горячая линия: +33 1 84 80 56 76',
    printBtn: 'Распечатать / Сохранить',
    backHome: 'Вернуться на главную SELY',
  },
  ja: {
    badge: 'お見積りリクエスト送信完了',
    title: 'ご依頼を正常に受け付けました',
    subtitle: 'SELY Privé をご利用いただき誠にありがとうございます。運行管理デスクにて内容を確認し、15分以内に正式なお見積書をお届けいたします。',
    refLabel: '予約照会番号',
    copyRef: 'コピー',
    copied: 'コピー完了！',
    serviceLabel: 'サービス種別',
    vehicleLabel: '配車車両',
    itineraryLabel: '運行ルート・日時',
    pickupLabel: 'お迎え場所',
    dropoffLabel: '目的地',
    dateTimeLabel: 'ご指定日時',
    flightLabel: '便名・列車番号',
    durationLabel: 'ご利用時間',
    clientLabel: 'お客様情報',
    fullNameLabel: 'ご氏名',
    driverInstructionsLabel: 'ドライバーへのご要望',
    hoursLabel: '時間',
    atLabel: '時間',
    passengersLabel: '名様',
    luggageLabel: '個',
    defaultServiceTransfer: 'ポイント間プライベート送迎',
    defaultServiceHourly: '専属ドライバー時間貸切',
    defaultServiceBespoke: 'オーダーメイド運行プログラム',
    phoneLabel: 'お電話番号',
    emailLabel: 'メールアドレス',
    companyLabel: '会社名・組織名',
    notesLabel: '特記事项・ご要望',
    bespokeLabel: '個別運行プラン',
    priceEstimate: '料金目安',
    priceNotice: '15分以内に正式確定見積を送信',
    stepsTitle: 'ご予約確定までのステップ',
    step1Title: '1. 運行ルートの即時確認 (15分以内)',
    step1Desc: '空車状況とVIPアクセス権を確認し、追加費用のないオールインクルーシブ確定料金を算出します。',
    step2Title: '2. 正式見積書および担当ドライバーのご案内',
    step2Desc: 'メールおよびSMSにて確定旅程表と専属ドライバーの直通連絡先をお知らせいたします。',
    step3Title: '3. 当日のネームボードお出迎え',
    step3Desc: 'お名前を掲げたドライバーがご指定場所でお待ちし、手荷物を丁寧にお運びいたします。',
    whatsappBtn: 'WhatsApp で即時問い合わせ',
    whatsappSub: 'パリ運行デスクによるリアルタイム対応',
    phoneBtn: '24時間VIP直通ダイヤル: +33 1 84 80 56 76',
    printBtn: '印刷 / 保存',
    backHome: 'SELY ホームへ戻る',
  }
};

export default function ReservationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCityPath, i18n, currentCity } = useCity();

  const [copied, setCopied] = useState(false);
  const [quoteData, setQuoteData] = useState(null);

  const rawLang = (i18n?.language || 'fr').split('-')[0].toLowerCase();
  const langKey = TEXTS[rawLang] ? rawLang : 'fr';

  const t = TEXTS[langKey] || TEXTS.fr;
  const isRtl = langKey === 'ar';

  useEffect(() => {
    // 1. Try React Router location state
    if (location.state && typeof location.state === 'object') {
      setQuoteData(location.state);
      return;
    }

    // 2. Fallback to sessionStorage
    try {
      const stored = sessionStorage.getItem('sely_latest_quote');
      if (stored) {
        setQuoteData(JSON.parse(stored));
        return;
      }
    } catch (e) {}

    // 3. Fallback mock reference for direct visits
    setQuoteData({
      ref: `SELY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      serviceLabel: 'Service de Chauffeur Privé Premium',
      cityName: 'Paris',
    });
  }, [location.state]);

  const trackedRef = useRef(false);

  // Fire Google Ads conversion tracking for "Demande de devis (1)"
  useEffect(() => {
    if (quoteData && !trackedRef.current) {
      trackedRef.current = true;
      trackQuoteConversion({
        ref: quoteData.ref,
        estimatedPrice: quoteData.estimatedPrice,
      });
    }
  }, [quoteData]);

  const handleCopyRef = () => {
    if (!quoteData?.ref) return;
    navigator.clipboard?.writeText(quoteData.ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = quoteData
    ? encodeURIComponent(
        `Bonjour SELY Privé,\n\nJe viens de transmettre ma demande de devis sur le site officiel.\n• Référence : ${quoteData.ref || 'SELY-DEV'}\n• Service : ${quoteData.serviceLabel || 'Transfert VIP'}${quoteData.vehicleName ? `\n• Véhicule : ${quoteData.vehicleName}` : ''}${quoteData.pickup ? `\n• Départ : ${quoteData.pickup}` : ''}${quoteData.destination ? `\n• Destination : ${quoteData.destination}` : ''}${quoteData.date ? `\n• Date : ${quoteData.date}` : ''}${quoteData.client?.firstName ? `\n• Nom : ${quoteData.client.firstName} ${quoteData.client.lastName || ''}` : ''}\n\nMerci de me confirmer la faisabilité et le devis.`
      )
    : encodeURIComponent("Bonjour SELY Privé, je viens d'effectuer une demande de devis sur le site.");

  return (
    <div className={`${styles.page} ${isRtl ? styles.rtl : ''}`}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header Hero Confirmation */}
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <CheckCircle2 size={42} strokeWidth={1.8} className={styles.checkIcon} />
          </div>

          <div className={styles.badge}>
            <ShieldCheck size={14} />
            <span>{t.badge}</span>
          </div>

          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>

          {/* Reference pill */}
          {quoteData?.ref && (
            <div className={styles.refContainer}>
              <span className={styles.refLabel}>{t.refLabel}</span>
              <div className={styles.refBox}>
                <span className={styles.refValue}>{quoteData.ref}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className={styles.copyBtn}
                  title={t.copyRef}
                  aria-label={t.copyRef}
                >
                  {copied ? <Check size={14} className={styles.copiedIcon} /> : <Copy size={14} />}
                  <span>{copied ? t.copied : t.copyRef}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quote Details Summary Grid */}
        {quoteData && (
          <div className={styles.summarySection}>
            <div className={styles.summaryGrid}>
              {/* Card 1: Service & Vehicle */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <Car size={18} className={styles.cardIcon} />
                  <h3>{t.serviceLabel} & {t.vehicleLabel}</h3>
                </div>

                {quoteData.vehicleImage && (
                  <div className={styles.vehiclePreview}>
                    <img
                      src={quoteData.vehicleImage}
                      alt={quoteData.vehicleName || 'Véhicule de prestige'}
                      className={styles.vehicleImg}
                    />
                  </div>
                )}

                <div className={styles.cardRows}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>{t.serviceLabel}</span>
                    <span className={styles.dataValueHighlight}>
                      {quoteData.service === 'transfer' ? t.defaultServiceTransfer : (quoteData.service === 'hourly' ? t.defaultServiceHourly : (quoteData.service === 'bespoke' ? t.defaultServiceBespoke : (quoteData.serviceLabel || t.defaultServiceTransfer)))}
                    </span>
                  </div>

                  {quoteData.vehicleName && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>{t.vehicleLabel}</span>
                      <span className={styles.dataValue}>{quoteData.vehicleName}</span>
                    </div>
                  )}

                  {(quoteData.passengers || quoteData.luggage) && (
                    <div className={styles.capacityRow}>
                      {quoteData.passengers && (
                        <span className={styles.capacityBadge}>
                          <Users size={13} /> {quoteData.passengers} {t.passengersLabel || 'passagers'}
                        </span>
                      )}
                      {quoteData.luggage && (
                        <span className={styles.capacityBadge}>
                          <Briefcase size={13} /> {quoteData.luggage} {t.luggageLabel || 'bagages'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Itinerary & Schedule */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <MapPin size={18} className={styles.cardIcon} />
                  <h3>{t.itineraryLabel}</h3>
                </div>

                <div className={styles.cardRows}>
                  {quoteData.pickup && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <MapPin size={12} className={styles.inlineIcon} /> {t.pickupLabel}
                      </span>
                      <span className={styles.dataValue}>{quoteData.pickup}</span>
                    </div>
                  )}

                  {quoteData.destination && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <MapPin size={12} className={styles.inlineIcon} /> {t.dropoffLabel}
                      </span>
                      <span className={styles.dataValue}>{quoteData.destination}</span>
                    </div>
                  )}

                  {quoteData.totalHours && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Clock size={12} className={styles.inlineIcon} /> {t.durationLabel}
                      </span>
                      <span className={styles.dataValueHighlight}>{quoteData.totalHours} {t.hoursLabel || 'heures'}</span>
                    </div>
                  )}

                  {(quoteData.date || quoteData.time) && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Calendar size={12} className={styles.inlineIcon} /> {t.dateTimeLabel}
                      </span>
                      <span className={styles.dataValue}>
                        {quoteData.date} {quoteData.time ? `${t.atLabel || 'à'} ${quoteData.time}` : ''}
                      </span>
                    </div>
                  )}

                  {quoteData.flightNumber && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Plane size={12} className={styles.inlineIcon} /> {t.flightLabel}
                      </span>
                      <span className={styles.dataValueHighlight}>{quoteData.flightNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Passenger & Contact Info */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <Users size={18} className={styles.cardIcon} />
                  <h3>{t.clientLabel}</h3>
                </div>

                <div className={styles.cardRows}>
                  {quoteData.client?.firstName && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>{t.fullNameLabel || 'Nom complet'}</span>
                      <span className={styles.dataValue}>
                        {quoteData.client.firstName} {quoteData.client.lastName || ''}
                      </span>
                    </div>
                  )}

                  {quoteData.client?.phone && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Phone size={12} className={styles.inlineIcon} /> {t.phoneLabel}
                      </span>
                      <span className={styles.dataValue}>{quoteData.client.phone}</span>
                    </div>
                  )}

                  {quoteData.client?.email && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Mail size={12} className={styles.inlineIcon} /> {t.emailLabel}
                      </span>
                      <span className={styles.dataValue}>{quoteData.client.email}</span>
                    </div>
                  )}

                  {quoteData.client?.company && quoteData.client.company !== '—' && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Building2 size={12} className={styles.inlineIcon} /> {t.companyLabel}
                      </span>
                      <span className={styles.dataValue}>{quoteData.client.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Additional Notes or Program */}
              {(quoteData.bespokeText || quoteData.specialRequests || quoteData.driverInstructions?.length > 0) && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <FileText size={18} className={styles.cardIcon} />
                    <h3>{quoteData.bespokeText ? t.bespokeLabel : t.notesLabel}</h3>
                  </div>

                  <div className={styles.cardRows}>
                    {quoteData.bespokeText && (
                      <div className={styles.notesBlock}>
                        <p>{quoteData.bespokeText}</p>
                      </div>
                    )}

                    {quoteData.specialRequests && (
                      <div className={styles.dataRow}>
                        <span className={styles.dataLabel}>{t.notesLabel}</span>
                        <span className={styles.dataValue}>{quoteData.specialRequests}</span>
                      </div>
                    )}

                    {quoteData.driverInstructions?.length > 0 && (
                      <div className={styles.dataRow}>
                        <span className={styles.dataLabel}>{t.driverInstructionsLabel || 'Consignes chauffeur'}</span>
                        <span className={styles.dataValue}>{quoteData.driverInstructions.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3-Step Protocol Walkthrough */}
        <div className={styles.protocolSection}>
          <h2 className={styles.protocolTitle}>{t.stepsTitle}</h2>

          <div className={styles.stepsGrid}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h4>{t.step1Title}</h4>
                <p>{t.step1Desc}</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h4>{t.step2Title}</h4>
                <p>{t.step2Desc}</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h4>{t.step3Title}</h4>
                <p>{t.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsGroup}>
          <a
            href={`https://wa.me/33184805676?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappActionBtn}
          >
            <MessageSquare size={18} style={{ color: '#25d366' }} />
            <div className={styles.btnTextStack}>
              <span className={styles.mainBtnText}>{t.whatsappBtn}</span>
              <span className={styles.subBtnText}>{t.whatsappSub}</span>
            </div>
          </a>

          <div className={styles.secondaryActions}>
            <a href="tel:+33184805676" className={styles.phoneActionBtn}>
              <Phone size={15} />
              <span>{t.phoneBtn}</span>
            </a>

            <button type="button" onClick={handlePrint} className={styles.printActionBtn}>
              <Printer size={15} />
              <span>{t.printBtn}</span>
            </button>
          </div>

          <div className={styles.footerLinkRow}>
            <Link to={getCityPath('/')} className={styles.homeLink}>
              <span>{t.backHome}</span>
              <ArrowRight size={15} className={styles.arrowIcon} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
