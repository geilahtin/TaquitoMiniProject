# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret):
        self.init(fromOwner           = fromOwner,
                  fromCounterparty    = fromCounterparty,
                  balanceOwner        = sp.tez(0),
                  balanceCounterparty = sp.tez(0),
                  hashedSecret        = hashedSecret,
                  epoch               = epoch,
                  owner               = owner,
                  counterparty        = counterparty,
                  authorizedAdmin     = sp.nat(0),
                  operator = sp.test_account("admin").address
        )

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(self.data.balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.fromOwner)
        sp.verify(self.data.authorizedAdmin == 0, "Admin has authorized withdrawal")
        self.data.balanceOwner = self.data.fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(self.data.balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.fromCounterparty)
        sp.verify(self.data.authorizedAdmin == 0, "Admin has authorized withdrawal")
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        sp.verify(sp.sender == identity)
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    @sp.entry_point
    def claimCounterparty(self, params):
        sp.verify(sp.now < self.data.epoch)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        sp.verify(self.data.authorizedAdmin == 0, "Admin has authorized withdrawal")
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        sp.verify(self.data.epoch < sp.now, "NOT VALID")
        sp.verify(self.data.authorizedAdmin == 0, "Admin has authorized withdrawal")
        self.claim(self.data.owner)

    @sp.entry_point
    def withdraw(self,checkOwner,checkCounterParty):
        sp.set_type(checkOwner, sp.TNat)
        sp.set_type(checkCounterParty, sp.TNat)
        
        sp.verify(sp.sender == self.data.operator, "NOT AUTHORIZED")
        sp.verify(checkOwner == sp.nat(1), "Owner does not agree to withdraw")
        sp.verify(checkCounterParty == sp.nat(1), "CounterParty does not agree to withdraw")

        sp.send(self.data.owner, self.data.balanceOwner)
        sp.send(self.data.counterparty, self.data.balanceCounterparty)

        self.data.authorizedAdmin = sp.nat(1)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    admin = sp.test_account("admin")
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")
    c1 = Escrow(sp.address("tz1hhwB2Ge5eu6KJPQzgLe6g3tfZzS9tpNTM"), sp.tez(1), sp.address("tz1hhwB2Ge5eu6KJPQzgLe6g3tfZzS9tpNTM"), sp.tez(1), sp.timestamp(1700000000), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e"))
    scenario += c1
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(1))
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(1))
    c1.withdraw(checkOwner = sp.nat(1), checkCounterParty = sp.nat(1)).run(sender = admin)
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(1))

sp.add_compilation_target("escrow", Escrow(sp.address("tz1hhwB2Ge5eu6KJPQzgLe6g3tfZzS9tpNTM"), sp.tez(1), sp.address("tz1hhwB2Ge5eu6KJPQzgLe6g3tfZzS9tpNTM"), sp.tez(1), sp.timestamp(1700000000), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e")))
