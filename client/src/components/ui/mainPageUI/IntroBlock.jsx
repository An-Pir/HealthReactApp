import img1 from '../../../assets/images/image1.jpg'

const IntroBlock = () => {
    return (
        <section>
            <h1 className='hidden sm:block md:text-3xl lg:text-4xl  text-center mt-5 '>
        Физкультурно-оздоровительный комплекс <br />
        <span className=' text-green/85'>
          "Здоровье"
        </span>
      </h1>

      <h1 className=' block sm:hidden  md:text-3xl lg:text-5xl text-center mt-5'>
        ФОК
        <span className='text-green/85'>
          "Здоровье"
        </span>
      </h1>
      <div className='flex gap-10 flex-wrap justify-center lg:flex-nowrap mt-5 '>
        <img
          src={img1}
          alt='Изображение фасада здания'
          className='hidden md:block mb-4 w-full lg:w-1/2 rounded-md object-contain'
        />
        <div className='  flex flex-col gap-y-2 w-full lg:w-1/2'>
          <p>
            Цель нашей работы пропаганда физической культуры и спорта, здорового
            образа жизни, активного отдыха и досуга.
          </p>
          <p>
            Если вы заинтересованы в сохранении здоровья и поддержании себя в
            отличной форме рекомендуем обратить внимание на
            физкультурно-оздоровительные занятия, организованные в нашем
            комплексе.
          </p>
          <p>
            Современное оснащение залов, профессиональные инструкторы и тренеры
            смогут дать инструкции и предложить программы поддержания себя в
            тонусе.
          </p>
        </div>
      </div>
        </section>
    );
};

export default IntroBlock;