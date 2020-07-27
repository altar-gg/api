module.exports = {
    hostname: "localhost",
    port: 80,

    // development keys, replace these in production!
    // they allow all requests regardless of hostname.
    captcha: {
        public: "6Ley6rMZAAAAAC7eW2ToVmfGRwe-1RhZHo_7buxD",
        private: "6Ley6rMZAAAAACvs_rPVgwf5mi1la6i6i8zRnmsF"
    },

    mongodb: {
        url: "mongodb://localhost:27017",
        name: "altar:dev"
    },
}