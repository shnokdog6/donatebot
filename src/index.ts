import {Telegraf} from "telegraf";
import {message} from "telegraf/filters";
import {Message} from "./types";
import axios from "axios";

const bot = new Telegraf("7213525217:AAF4bRlj2VOCG2CV6po7yQ_zT1MVWMEsR0M");

interface User {
    id: number;
    nickname?: string;
    sum: number;
}

const users: User[] = [];

bot.start(async (ctx) => {
    const user = users.find(a => a.id === ctx.message.from.id);

    if (!user) {
        users.push({id: ctx.message.from.id, sum: 0})
        await ctx.sendMessage("Привет, для начала напиши ник, которые будет отображаться в донате");
        return;
    }

});

bot.on(message("text"), async (ctx) => {
    const user = users.find(a => a.id === ctx.message.from.id);
    if (!user) {
        users.push({id: ctx.from.id, sum: 0})
        await ctx.sendMessage("Привет, ты ещё не авторизирован, нажми, чтобы начать", {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Начать", callback_data: "start"}],
                ]
            }
        });
        return;
    }

    if (!user.nickname) {
        const nickname = ctx.message.text;
        const isAvailable = !users.find(a => a.nickname === nickname);

        if (!isAvailable) {
            await ctx.sendMessage("Прости, но данные ник занят, выбери другой");
            return;
        }

        user.nickname = nickname;
        await ctx.sendMessage(`Ник: ${nickname}\nОбщая сумма донатов: ${user.sum}₽`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: Message.DONATE, callback_data: "make-donate"}],
                    [{text: Message.PROFILE, callback_data: "edit-profile"}]
                ],
            },

        });

        return;
    }
});

bot.action("start", async (ctx) => {
    await ctx.sendMessage("Привет, для начала напиши ник, которые будет отображаться в донате");
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("make-donate", async (ctx) => {
    await ctx.sendMessage("Выберите сумму, которую хотите отправить", {
        reply_markup: {
            inline_keyboard: [
                [{text: "50 ⭐ = 100₽", callback_data: "payment-1"}],
                [{text: "250 ⭐ = 500₽", callback_data: "payment-2"}],
                [{text: "500 ⭐ = 1000₽", callback_data: "payment-3"}],
                [{text: "750 ⭐ = 1500₽", callback_data: "payment-4"}],
                [{text: "Отмена", callback_data: "cancel-payment"}],
            ]
        }
    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("cancel-payment", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    await ctx.sendMessage(`Ник: ${user!.nickname}\nОбщая сумма донатов: ${user!.sum}₽`, {
        reply_markup: {
            inline_keyboard: [
                [{text: Message.DONATE, callback_data: "make-donate"}],
                [{text: Message.PROFILE, callback_data: "edit-profile"}]
            ],
        },

    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("payment-1", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    await ctx.sendInvoice({
        title: "Оплата",
        description: "Оплатить пожертвование",
        prices: [{label: "XTR", amount: 50}],
        provider_token: "",
        currency: "XTR",
        payload: "channel_support"
    }, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Оплатить", pay: true}],
                [{text: "Назад", callback_data: "make-donate"}],
            ]
        }
    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("payment-2", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    await ctx.sendInvoice({
        title: "Оплата",
        description: "Оплатить пожертвование",
        prices: [{label: "XTR", amount: 250}],
        provider_token: "",
        currency: "XTR",
        payload: "channel_support"
    }, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Оплатить", pay: true}],
                [{text: "Назад", callback_data: "make-donate"}],
            ]
        }
    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("payment-3", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    await ctx.sendInvoice({
        title: "Оплата",
        description: "Оплатить пожертвование",
        prices: [{label: "XTR", amount: 500}],
        provider_token: "",
        currency: "XTR",
        payload: "channel_support"
    }, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Оплатить", pay: true}],
                [{text: "Назад", callback_data: "make-donate"}],
            ]
        }
    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.action("payment-4", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    await ctx.sendInvoice({
        title: "Оплата",
        description: "Оплатить пожертвование",
        prices: [{label: "XTR", amount: 750}],
        provider_token: "",
        currency: "XTR",
        payload: "channel_support"
    }, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Оплатить", pay: true}],
                [{text: "Назад", callback_data: "make-donate"}],
            ]
        }
    });
    await ctx.deleteMessage(ctx.callbackQuery.message!.message_id);
    await ctx.answerCbQuery("", {
        show_alert: false
    });
});

bot.on("successful_payment", async (ctx) => {
    const user = users.find(a => a.id === ctx.from.id);
    const donateSum = ctx.message.successful_payment.total_amount * 2;

    user!.sum += donateSum;
    await axios.post("https://donatepay.ru/api/v1/notification", {
        "access_token": "hiAzAcoA1IHgE4aIujYxrOrSAOFxoxwzcgy3vEtguWpxJd3dX7RIRdeNucuy",
        "name": user!.nickname,
        "sum": donateSum

    });
    await ctx.sendMessage("Донат отправлен!", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Назад", callback_data: "cancel-payment"}],
            ]
        }
    });
});

bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true);
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))