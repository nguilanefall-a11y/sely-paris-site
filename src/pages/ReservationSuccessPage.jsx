import React, { useState, useEffect } from 'react';
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
import styles from './ReservationSuccessPage.module.css';

const TEXTS = {
  fr: {
    badge: 'Demande de Devis Transmise',
    title: 'Votre demande de devis est confirmée',
    subtitle: 'Nous vous remercions de votre confiance. Notre direction opérationnelle étudie votre itinéraire et vous transmet votre devis ferme sous 15 minutes.',
    refLabel: 'Référence dossier',
    copyRef: 'Copier la référence',
    copied: 'Copié !',
    serviceLabel: 'Prestation',
    vehicleLabel: 'Véhicule',
    itineraryLabel: 'Itinéraire & Horaires',
    pickupLabel: 'Prise en charge',
    dropoffLabel: 'Destination / Rayon',
    dateTimeLabel: 'Date & Heure',
    flightLabel: 'Numéro de vol / train',
    durationLabel: 'Durée de mise à disposition',
    clientLabel: 'Passager & Contact',
    phoneLabel: 'Téléphone',
    emailLabel: 'Email',
    companyLabel: 'Société',
    notesLabel: 'Précisions & Instructions',
    bespokeLabel: 'Programme de mobilité',
    priceEstimate: 'Tarification indicative',
    priceNotice: 'Devis officiel transmis sous 15 min',
    stepsTitle: 'Protocole de prise en charge SELY Privé',
    step1Title: '1. Étude opérationnelle immédiate (< 15 min)',
    step1Desc: 'Vérification télémétrique des temps de trajet, des accès réservés et calcul de la tarification officielle garantie sans supplément caché.',
    step2Title: '2. Transmission du devis ferme & Fiche chauffeur',
    step2Desc: 'Réception de votre récapitulatif par email et SMS, avec lien de confirmation et coordonnées directes de votre chauffeur dédié.',
    step3Title: '3. Prise en charge d’Excellence & Accueil VIP',
    step3Desc: 'Suivi des arrivées en temps réel (attente offerte en cas de retard), accueil personnalisé avec pancarte nominative et port des bagages.',
    whatsappBtn: 'Confirmer et échanger sur WhatsApp',
    whatsappSub: 'Réponse prioritaire instantanée par notre équipe opérationnelle',
    phoneBtn: 'Assistance VIP 24/7 : +33 1 84 80 56 76',
    printBtn: 'Imprimer / Sauvegarder le récapitulatif',
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
    pickupLabel: 'Punto de recogida',
    dropoffLabel: 'Destino',
    dateTimeLabel: 'Fecha y Hora',
    flightLabel: 'Número de vuelo / tren',
    durationLabel: 'Duración del servicio',
    clientLabel: 'Pasajero y Contacto',
    phoneLabel: 'Teléfono',
    emailLabel: 'Email',
    companyLabel: 'Empresa',
    notesLabel: 'Instrucciones especiales',
    bespokeLabel: 'Programa a medida',
    priceEstimate: 'Tarifa indicativa',
    priceNotice: 'Presupuesto oficial enviado en 15 min',
    stepsTitle: 'Protocolo de atención SELY Privé',
    step1Title: '1. Estudio operativo inmediato (< 15 min)',
    step1Desc: 'Verificación de accesos y cálculo de la tarifa oficial garantizada sin suplementos ocultos.',
    step2Title: '2. Envío del presupuesto y datos del chófer',
    step2Desc: 'Recepción del resumen por email y SMS con enlace de confirmación y teléfono directo de su conductor.',
    step3Title: '3. Acogida VIP y seguimiento en directo',
    step3Desc: 'Seguimiento de vuelos (espera gratuita ante retrasos), bienvenida con cartel nominativo y asistencia con el equipaje.',
    whatsappBtn: 'Confirmar al instante por WhatsApp',
    whatsappSub: 'Atención prioritaria inmediata con nuestro centro de operaciones',
    phoneBtn: 'Línea VIP 24/7: +33 1 84 80 56 76',
    printBtn: 'Imprimir / Guardar presupuesto',
    backHome: 'Volver al inicio',
  },
  ar: {
    badge: 'تم تأكيد طلب عرض السعر بنجاح',
    title: 'تم تأكيد طلبكم بنجاح',
    subtitle: 'نشكركم على ثقتكم في SELY Privé. يقوم فريق العمليات بمراجعة مساركم وسيرسل عرض السعر الرسمي المؤكد خلال 15 دقيقة.',
    refLabel: 'رقم المرجع',
    copyRef: 'نسخ المرجع',
    copied: 'تم النسخ!',
    serviceLabel: 'نوع الخدمة',
    vehicleLabel: 'السيارة المختارة',
    itineraryLabel: 'المسار والمواعيد',
    pickupLabel: 'نقطة الانطلاق',
    dropoffLabel: 'الوجهة',
    dateTimeLabel: 'التاريخ والوقت',
    flightLabel: 'رقم الرحلة / القطار',
    durationLabel: 'مدة الخدمة',
    clientLabel: 'الراكب والتواصل',
    phoneLabel: 'رقم الهاتف',
    emailLabel: 'البريد الإلكتروني',
    companyLabel: 'الشركة',
    notesLabel: 'ملاحظات خاصة',
    bespokeLabel: 'برنامج التنقل المخصص',
    priceEstimate: 'السعر التقديري',
    priceNotice: 'عرض السعر الرسمي يصلكم خلال 15 دقيقة',
    stepsTitle: 'بروتوكول خدمة كبار الشخصيات من SELY Privé',
    step1Title: '1. مراجعة تشغيلية فورية (خلال 15 دقيقة)',
    step1Desc: 'تحليل حركة السير والتصاريح الخاصة واحتساب السعر الشامل والمضمون دون أي تكاليف خفية.',
    step2Title: '2. إرسال عرض السعر وبيانات السائق المعتمد',
    step2Desc: 'استلام الملخص الرسمي عبر البريد والرسائل مع رابط التأكيد ورقم التواصل المباشر مع السائق.',
    step3Title: '3. استقبال فاخر وتتبع الرحلة في الوقت الفعلي',
    step3Desc: 'متابعة حركة الطيران والقطارات مع انتظار مجاني عند التأخير، واستقبال بلافتة اسمية ومساعدة بالأمتعة.',
    whatsappBtn: 'تأكيد مباشر وفوري عبر واتساب',
    whatsappSub: 'استجابة فائقة السرعة من إدارة العمليات في باريس',
    phoneBtn: 'الخط المباشر لكبار الشخصيات 24/7: 76 56 80 84 1 33+',
    printBtn: 'طباعة / حفظ ملخص الحجز',
    backHome: 'العودة إلى الصفحة الرئيسية',
  },
  zh: {
    badge: '官方报价申请已确认',
    title: '您的报价申请已成功提交',
    subtitle: '感谢您选择 SELY Privé。我们的运营管理团队正在审核您的行程，并将在 15 分钟内向您发送正式报价。',
    refLabel: '预订编号',
    copyRef: '复制编号',
    copied: '已复制！',
    serviceLabel: '服务类型',
    vehicleLabel: '所选车型',
    itineraryLabel: '行程与时间',
    pickupLabel: '出发地点',
    dropoffLabel: '目的地',
    dateTimeLabel: '日期与时间',
    flightLabel: '航班 / 车次号',
    durationLabel: '包车时长',
    clientLabel: '乘客与联系人',
    phoneLabel: '联系电话',
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
  }
};

export default function ReservationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCityPath, i18n, currentCity } = useCity();

  const [copied, setCopied] = useState(false);
  const [quoteData, setQuoteData] = useState(null);

  const langKey = i18n?.language?.startsWith('en')
    ? 'en'
    : i18n?.language?.startsWith('es')
    ? 'es'
    : i18n?.language?.startsWith('ar')
    ? 'ar'
    : i18n?.language?.startsWith('zh')
    ? 'zh'
    : 'fr';

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
      <div className={styles.ambientGlow} />

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
                      {quoteData.serviceLabel || 'Transfert Point A à B'}
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
                          <Users size={13} /> {quoteData.passengers} passagers
                        </span>
                      )}
                      {quoteData.luggage && (
                        <span className={styles.capacityBadge}>
                          <Briefcase size={13} /> {quoteData.luggage} bagages
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
                      <span className={styles.dataValueHighlight}>{quoteData.totalHours} heures</span>
                    </div>
                  )}

                  {(quoteData.date || quoteData.time) && (
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        <Calendar size={12} className={styles.inlineIcon} /> {t.dateTimeLabel}
                      </span>
                      <span className={styles.dataValue}>
                        {quoteData.date} {quoteData.time ? `à ${quoteData.time}` : ''}
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
                      <span className={styles.dataLabel}>Nom complet</span>
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
                        <span className={styles.dataLabel}>Consignes chauffeur</span>
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
            <MessageSquare size={18} />
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
