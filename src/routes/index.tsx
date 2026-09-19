import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Identidade Visual / Header */}
      <header className="py-6 px-8 md:px-16 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
          <HeartPulse className="w-10 h-10 md:w-12 md:h-12 text-rose-600" />
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">ClinicCare</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-12 text-xl font-semibold text-slate-600">
            <li><a href="#services" className="hover:text-rose-600 transition-colors">Especialidades</a></li>
            <li><a href="#about" className="hover:text-rose-600 transition-colors">Sobre Nós</a></li>
            <li><a href="#contact" className="hover:text-rose-600 transition-colors">Contato</a></li>
          </ul>
        </nav>
        <button className="hidden md:flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-bold text-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
          <Calendar className="w-6 h-6" />
          Agendar Agora
        </button>
      </header>

      <main>
        {/* Hero Section com Tipografia Gigante */}
        <section className="relative bg-white pt-28 pb-40 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-rose-50/50 -skew-y-3 transform origin-top-left -z-10" />
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-100 text-rose-700 font-bold mb-10 text-xl">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              Atendimento Humanizado
            </div>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 leading-[1.1] mb-10 tracking-tight max-w-5xl">
              Sua saúde e bem-estar <br className="hidden md:block"/> 
              em <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500">excelentes mãos</span>.
            </h2>
            <p className="text-2xl md:text-3xl text-slate-600 mb-16 max-w-4xl leading-relaxed font-medium">
              Descubra uma nova forma de cuidar de si mesma com especialistas dedicados ao atendimento acolhedor, moderno e 100% focado em você.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 w-full justify-center max-w-2xl mx-auto">
              <button className="flex-1 bg-rose-600 text-white text-2xl font-black py-6 px-10 rounded-full shadow-2xl hover:shadow-rose-500/50 hover:bg-rose-700 transform hover:-translate-y-2 transition-all duration-300">
                Agendar Consulta
              </button>
              <button className="flex-1 bg-white text-slate-800 border-2 border-slate-200 text-2xl font-bold py-6 px-10 rounded-full shadow-sm hover:border-rose-300 hover:bg-rose-50 transition-all duration-300">
                Nossos Serviços
              </button>
            </div>
          </div>
        </section>

        {/* Serviços / Benefícios com Layout Organizado */}
        <section id="services" className="py-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">Como podemos ajudar?</h3>
            <p className="text-2xl md:text-3xl text-slate-500 max-w-3xl mx-auto font-medium">
              Oferecemos um portfólio completo de cuidados focados exclusivamente na saúde feminina.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Card 1 */}
            <div className="bg-white p-14 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-rose-600 mb-10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Stethoscope className="w-10 h-10" />
              </div>
              <h4 className="text-4xl font-extrabold text-slate-900 mb-6">Consultas</h4>
              <p className="text-2xl text-slate-600 leading-relaxed font-medium">
                Atendimento preventivo e de rotina, avaliando seu histórico para uma abordagem totalmente individualizada.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-14 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03]">
                <HeartPulse className="w-64 h-64" />
              </div>
              <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-rose-600 mb-10 group-hover:scale-110 transition-transform duration-300 shadow-inner relative z-10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-4xl font-extrabold text-slate-900 mb-6 relative z-10">Diagnósticos</h4>
              <p className="text-2xl text-slate-600 leading-relaxed font-medium relative z-10">
                Exames preventivos e acompanhamentos laboratoriais estruturados para detectar alterações precocemente.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-14 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-rose-600 mb-10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Calendar className="w-10 h-10" />
              </div>
              <h4 className="text-4xl font-extrabold text-slate-900 mb-6">Pré-Natal</h4>
              <p className="text-2xl text-slate-600 leading-relaxed font-medium">
                Cuidado integral, seguro e acolhedor para gestantes, garantindo total tranquilidade da concepção ao parto.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Envolvente */}
        <section className="bg-rose-600 text-white py-32 px-8 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 leading-tight tracking-tight">Pronta para colocar sua saúde em primeiro lugar?</h3>
            <p className="text-3xl text-rose-100 mb-16 max-w-4xl mx-auto font-medium">
              Fale conosco hoje mesmo. Agende de forma rápida e prática pelo WhatsApp ou pela nossa plataforma web.
            </p>
            <button className="bg-white text-rose-600 text-3xl font-black py-8 px-16 rounded-full shadow-2xl hover:bg-slate-50 transform hover:scale-[1.03] transition-all duration-300">
              Marcar Minha Consulta
            </button>
          </div>
        </section>
      </main>

      {/* Footer Profissional e Elegante */}
      <footer id="contact" className="bg-slate-900 text-white py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <HeartPulse className="w-12 h-12 text-rose-500" />
              <h4 className="text-5xl font-black tracking-tight">ClinicCare</h4>
            </div>
            <p className="text-2xl text-slate-400 font-medium mb-4">Av. Paulista, 1000 - São Paulo, SP</p>
            <p className="text-2xl text-slate-400 font-medium mb-8">Segunda a Sexta, 08:00 às 18:00</p>
          </div>
          <div className="md:text-right flex flex-col justify-center">
            <p className="text-3xl mb-6 font-bold text-slate-300">Fale com nossa equipe</p>
            <a href="mailto:contato@cliniccare.com.br" className="text-3xl md:text-4xl text-rose-500 hover:text-rose-400 font-black mb-6 block transition-colors">
              contato@cliniccare.com.br
            </a>
            <p className="text-3xl md:text-4xl font-black text-white">(11) 99999-9999</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t-2 border-slate-800 mt-20 pt-10 text-center text-slate-500 text-xl font-medium">
          &copy; {new Date().getFullYear()} ClinicCare. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
