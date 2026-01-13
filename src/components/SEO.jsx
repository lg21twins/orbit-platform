// import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

export default function SEO({ title, description, image }) {
    // const { lang } = useLanguage();
    // const siteTitle = "Ye-chan Son | Frontend Developer Portfolio";
    // const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    // const metaDesc = description || (lang === 'ko' ? "손예찬의 개인 포트폴리오 사이트입니다." : "Personal portfolio of Ye-chan Son, a Frontend Developer.");

    return null;
    /*
    return (
        <Helmet>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            {image && <meta property="og:image" content={image} />}
            <meta name="twitter:card" content="summary_large_image" />
            <html lang={lang} />
        </Helmet>
    );
    */
}
