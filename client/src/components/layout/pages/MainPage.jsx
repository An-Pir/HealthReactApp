import img2 from '../../../assets/images/Peretyazhki-2.jpg';
import IntroBlock from '../../ui/mainPageUI/IntroBlock';
import RequestBlock from '../../ui/mainPageUI/RequestBlock';
import Slider from '../../ui/mainPageUI/Slider';
import EventsBlock from '../../ui/mainPageUI/EventsBlock';
import ServicesBlock from '../../ui/mainPageUI/ServicesBlock';

const MainPage = () => {
  return (
    <main className='container m-auto p-4 flex flex-col gap-5 bg-white'>
      <img src={img2} alt='Растяжка 80 лет Победы' />
      <IntroBlock />
      <RequestBlock />
      <Slider />
      <EventsBlock />
      <ServicesBlock />
    </main>
  );
};

export default MainPage;
