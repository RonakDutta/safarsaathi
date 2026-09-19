function Bodyfooter() {
  const steps = [["01", "Tell us where", "Enter a pickup point, contact details, and the time you need."], ["02", "Choose payment", "Pay online securely or settle with cash after your ride."], ["03", "Meet your driver", "A verified professional is assigned to your booking."]];
  return <>
    <section className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl"><p className="eyebrow">Simple by design</p><div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="section-title max-w-xl">A better way to plan the road ahead.</h2><p className="max-w-sm text-slate-600">No surge guessing. No rushed point-to-point ride. Just a driver when you need one.</p></div>
        <div className="mt-14 grid border-t border-slate-200 md:grid-cols-3">{steps.map(([number, title, copy]) => <article key={number} className="border-b border-slate-200 py-8 md:border-b-0 md:px-8 md:first:pl-0 md:not-last:border-r"><p className="text-sm font-semibold text-amber-600">{number}</p><h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></article>)}</div>
      </div>
    </section>
    <section className="bg-slate-100 px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center"><img src="https://images.pexels.com/photos/1521580/pexels-photo-1521580.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Driver at the wheel" className="h-100 w-full object-cover" /><div><p className="eyebrow">Built around trust</p><h2 className="section-title mt-4">Every journey gets the attention it deserves.</h2><dl className="mt-9 space-y-6"><div><dt className="font-semibold text-slate-950">Vetted drivers</dt><dd className="mt-1 text-slate-600">Applications are reviewed by our team before drivers join the platform.</dd></div><div><dt className="font-semibold text-slate-950">Clear hourly pricing</dt><dd className="mt-1 text-slate-600">Book the time you need and know how your fare is calculated.</dd></div><div><dt className="font-semibold text-slate-950">Flexible payment</dt><dd className="mt-1 text-slate-600">Choose secure online payment or cash after the ride.</dd></div></dl></div></div></section>
  </>;
}
export default Bodyfooter;
