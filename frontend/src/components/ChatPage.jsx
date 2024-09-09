import React from "react";

export default function ChatPage() {
  return (
    <div className="grid grid-cols-2">
      <div className="flex w-screen">
        <div className="lg:flex-[0.5]"></div>
        <div className="lg:flex-[50] md:flex-[3] sm:flex-[1] mx-6 mt-10">
          <div className="flex sm:max-w-[56rem] lg:max-w-full mx-auto sm:pl-44">
            <section className="w-full h-[55rem] outline-dashed overflow-y-auto">
              ChatPage
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
